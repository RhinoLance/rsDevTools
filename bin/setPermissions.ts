#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import { IRhinoSpectConfig, IRhinoSpectConfigList } from "../Classes/IRhinoSpectConfigList";
import { ModuleProcessor } from "../Classes/ModuleProcessor";
import { IMapFeature } from "../Classes/Module";
import { ApiService } from "../Classes/RhinoSpect.Api";
import { IPermissions, PermissionProcessor } from "../Classes/PermissionProcessor";
import { isImportClause } from "typescript";


let _configFile: string |undefined;

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

var program:any = new Command("setPermissions <configFile>")
		.version( "1.0.0" )
		.argument('<configFile>', "path to the RhinoSpect config file.")
		.action( (configFile) => {
			_configFile = configFile;
		})
		.option( "-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
		.requiredOption( "-u --user <string>", "Specify the UserId to update.")
		.option( "-n --note <string>", "Specify a note to be saved with the user permission.")
		.option( "--read", "Add read permission.")
		.option( "--no-read", "Remove read permission.")
		.option( "--write", "Add write permission.")
		.option( "--no-write", "Remove write permission.")
		.option( "--moduleEdit", "Add moduleEdit permission.")
		.option( "--no-moduleEdit", "Remove moduleEdit permission.")
		.option( "--security", "Add security permission.")
		.option( "--no-security", "Remove security permission.")
		.option( "--assignTo", "Add assignTo permission.")
		.option( "--no-assignTo", "Remove assignTo permission.")
		.option( "--restrictToAssignedTo", "Add restrictToAssignedTo permission.")
		.option( "--no-restrictToAssignedTo", "Remove restrictToAssignedTo permission.")
		.parse(process.argv);

main( program, _configFile )
	.catch(error => {
		fatal( error + "\n" );
		process.exit(1);
	});

function success(message: string) {
	console.log(emojis.happy + " " + chalk.greenBright( message ));
}

function error(message: string){
	console.error( emojis.fire + " " + chalk.redBright( message ));
}

function fatal(message: string){
	console.error( emojis.skull + " " + chalk.redBright( message ));
	process.stderr.write( emojis.skull + " " + chalk.redBright( message ));
	process.exit(1);
}

async function main(program: any, configPath?: string  ) {


	const options = program.opts();
	const config = getConfig(configPath, options.config);
	const permissions: IPermissions = options;
	const userIdArg: string = options.user;


	const apiSvc = new ApiService(config.url, config.token);

	const processor = new PermissionProcessor();

	let userId: string;
	let email: string = userIdArg.indexOf("@") == -1 ? "" : userIdArg;
	let moduleUser: ApiService.IModuleUser;
	try{
		userId = email.length === 0 ? userIdArg : (await apiSvc.getUser(userIdArg)).userId;
		moduleUser = await apiSvc.getModuleUser(config.moduleId, userId);
	}
	catch(ex) {
		throw `There was a problem retrieving the user for '${userIdArg}'\n${ex}`;
	}

	if( moduleUser == undefined) {
		//Module user not found, create a new record.
		moduleUser = {
			moduleId: config.moduleId,
			userId: userId,
			description: options.note,
			permissions: 0,
			email: email
		};
	};

	moduleUser.permissions = processor.calculatePermissions(moduleUser.permissions, permissions);
	console.log(`Options: ${JSON.stringify(options)}`);
	if( options.note ){
		moduleUser.description = options.note;
	}

	try{
		console.log(`ModuleUser: ${JSON.stringify(moduleUser)}`);
		await apiSvc.setModuleUser(moduleUser);
	}
	catch(ex) {
		throw `There was a problem saving the module permissions for '${userId}' on module '${config.name}'\n${ex}`;
	}

	success(`Module succesfully saved to server: ${config.name}`);

}

function getConfig( configPath?: string, configName?: string ): IRhinoSpectConfig {
	let jsonPath;
	if( configPath ){
		jsonPath = configPath;
	}
	else{
		jsonPath = path.join(__dirname, '..', 'rhinospect.conf.json');
	}

	let config: IRhinoSpectConfig | undefined;
	try{
		var jsonString = fs.readFileSync(jsonPath, 'utf8');
		var configFileObj: IRhinoSpectConfigList = JSON.parse(jsonString);
		config = configFileObj.publishConfigurationList.find(v=> v.name == (configName ?? "default") );
	}
	catch(ex) {
		fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${ex.message}`);
	}

	if( !config ){
		throw(`The specified config could not be found, or there is no default configuration.\nAttempted to load config from "${path.resolve(jsonPath)}"`);
	}

	return config;

}

function readFile( filePath: string ): string {

	let data: string;

	try{
		data = fs.readFileSync(filePath, 'utf8');
	}
	catch(ex) {
		throw(`The specified source file could not be found at ${path.resolve(filePath)}`);
	}

	return data;
}