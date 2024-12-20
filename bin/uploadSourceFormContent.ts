#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import { IRhinoSpectConfig, IRhinoSpectConfigList } from "../Classes/IRhinoSpectConfigList";
import { ModuleProcessor } from "../Classes/ModuleProcessor";
import { SourceReader } from "../Classes/SourceReader";


let _configFile: string = "123";

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥",
	curvy: "〰️",
	whiteCircle: "⚪",
	wait: ""
}

var program:any = new Command("uploadSourceFormContent <configFile>")
		.version( "1.0.0" )
		.arguments('[configFile]')
		.action( (configFile) => {
			_configFile = configFile;
		})
		.option( "-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
		.parse(process.argv);

try{
	main( program, _configFile );
}
catch( error ){
	fatal( error + "\n" );
	process.exit(1);
}

function action(message: string) {
	console.log(emojis.wait + " " + chalk.white( message ));
}

function success(message: string) {
	console.log(emojis.happy + " " + chalk.greenBright( message ));
}

function error(message: string){
	console.error( emojis.fire + " " + chalk.redBright( message ));
}

function fatal(message: string){
	console.error( emojis.skull + " " + chalk.redBright( message ));
	process.exit(1);
}

function main(program: any, configPath?: string ) {

	const options = program.opts();
	const config = getConfig(configPath, options.config);

	const processor = new ModuleProcessor(config);

	const promiseList: Promise<void>[] = [];
	config.classMap.map( v=> {

		action(`Reading local source files for ${v.componentName}`);
		const reader = new SourceReader(v.sourceFolder);

		try{
			const parts = reader.getSourceParts(v.componentName);
			const template = v.templateFilePath ? JSON.parse(reader.getFileContents(v.templateFilePath)) : undefined;

			success(`Source ready`);

			action(`Retrieving module from server, and updating ${v.className} class`);

			promiseList.push( processor.updateClass(v, parts, template ) );
		}
		catch (ex) {
			
			error( `${(ex instanceof Error) ? ex.message : ex}` );
		}

	});

	Promise.all(promiseList)
	.then(result => {

		success(`Update successfull`);

		action(`Pushing module to server: ${config.serverName}`);
		return processor.pushModuleToServer();
	})
	.then( result => {
		success(`Module succesfully saved to server`);
	})
	.catch( ex => error( "Error: " + ex));


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
		fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${(ex instanceof Error) ? ex.message : ex}`);
	}

	if( !config ){
		throw(`The specified config section could not be found, or there is no default configuration.\nUnable to find "${(configName ?? "default")}" in "${path.resolve(jsonPath)}"`);
	}

	return config;

}