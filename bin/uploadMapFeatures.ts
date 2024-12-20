#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import { IRhinoSpectConfig, IRhinoSpectConfigList } from "../Classes/IRhinoSpectConfigList";
import { ModuleProcessor } from "../Classes/ModuleProcessor";
import { IMapFeature } from "../Classes/Module";


let _configFile: string = "123";

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

var program:any = new Command("uploadMapFeatures <configFile> <sourceFile>")
		.version( "1.0.0" )
		.arguments('<configFile>')
		.action( (configFile) => {
			_configFile = configFile;
		})
		.option( "-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
		.option( "-d --data <string>", "Specify the data file to upload.  If not specified it will use data file path specified in the configuration.")
		.parse(process.argv);

try{
	main( program, _configFile );
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

function main(program: any, configPath?: string ) {

	const options = program.opts();
	const config = getConfig(configPath, options.config);

	const processor = new ModuleProcessor(config);

	let dataFilePath = options.data ? options.data : config.mapFeatureFilePath;
	if( !dataFilePath ) {
		throw Error( "No map features file was provided.  Please specify it in the --data argument, or config file.")
	}

	const data = <IMapFeature[]>JSON.parse(readFile( dataFilePath ));

	processor.updateMapFeatures(data)
	.then(result => {

		success(result);
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