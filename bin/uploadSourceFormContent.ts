#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import { IRhinoSpectConfig, IRhinoSpectConfigList } from "../Classes/IRhinoSpectConfigList";
import { ModuleProcessor } from "../Classes/ModuleProcessor";
import { SourceReader } from "../Classes/SourceReader";


let configFile: string = "123";

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

var program:any = new Command("transpileSourceForm <configFile>")
		.version( "1.0.0" )
		.arguments('<configFile>')
		.action( (configFile) => {
			configFile = configFile;
		})
		.option( "-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
		.parse(process.argv);

try{
	main( configFile, program.config );
}
catch( error ){
	fatal( error + "\n" );
	process.exit(1);
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

function main(configPath?: string, configName?: string ) {

	const config = getConfig(configPath, configName);

	const processor = new ModuleProcessor(config);

	const promiseList: Promise<void>[] = [];
	config.classMap.map( v=> {

		success(`Retrieving source for ${v.componentName}`);
		const reader = new SourceReader(v.sourceFolder);

		try{
			const parts = reader.getSourceParts(v.componentName);
			const template = JSON.parse(reader.getFileContents(v.templateFilePath));

			success(`Updating module class ${v.classId}`);

			promiseList.push( processor.updateClass(v, parts, template ) );
		}
		catch (ex) {
			error( ex.message );
		}

	});

	Promise.all(promiseList)
	.then(result => {

		success(`Pushing module to server: ${config.name}`);
		return processor.pushModuleToServer();
	})
	.then( result => {
		success(`Module succesfully saved to server: ${config.name}`);
	})
	.catch( ex => error( "Error: " + ex));


}

function getConfig( configPath?: string, configName?: string ): IRhinoSpectConfig {
	let jsonPath;
	if( configPath ){
		jsonPath = path.join('.//', 'rhinospect.conf.json');
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
		throw("The specified config could not be found, or there is no default configuration.");
	}

	return config;

}