#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import { IRhinoSpectConfig, IRhinoSpectConfigList, ITemplateAndPatch } from "../Classes/IRhinoSpectConfigList";
import { ModuleProcessor } from "../Classes/ModuleProcessor";
import { SourceReader } from "../Classes/SourceReader";
import { FilePatcher } from "../Classes/FilePatcher";
import { tmpdir } from 'os';



let _configFile: string = "./rhinospect.conf.json";

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥",
	curvy: "〰️",
	whiteCircle: "⚪",
	wait: ""
}

var program: any = new Command("patchModule [configFile]")
	.version("1.0.0")
	.arguments('[configFile]')
	.action((configFile) => {
		_configFile = configFile || _configFile;
	})
	.option("-c --config <string>", "Specify the configuration to run.  If not specified it will use the default configuration.")
	.parse(process.argv);

try {
	main(program, _configFile);
}
catch (error) {
	fatal(error + "\n");
	process.exit(1);
}

function action(message: string) {
	console.log(emojis.wait + " " + chalk.white(message));
}

function success(message: string) {
	console.log(emojis.happy + " " + chalk.greenBright(message));
}

function error(message: string) {
	console.error(emojis.fire + " " + chalk.redBright(message));
}

function fatal(message: string) {
	console.error(emojis.skull + " " + chalk.redBright(message));
	process.exit(1);
}

function main(program: any, configPath?: string) {

	const options = program.opts();
	const config = getConfig(configPath, options.config);

	const processor = new ModuleProcessor(config);

	const promiseList: Promise<void>[] = [];

	try{

		if( config.moduleAttributes) {
			promiseList.push(patchModule(config.moduleAttributes, processor));
			console.log("");
		}

		if( config.classMap ) {
			promiseList.push(...patchClasses(config, processor));
			console.log("");
		}
	}
	catch (ex) {
		if (ex instanceof Error) {
			fatal(ex.message);
		} else {
			console.log('Unexpected error', ex);
		}
	}

	Promise.all(promiseList)
		.then(result => {

			success(`Module patched successfully`);

			action(`Pushing module to server: ${config.serverName}`);
			return processor.pushModuleToServer();
		})
		.then(result => {
			success(`Module succesfully saved to server`);

			const outPath = `${tmpdir()}/${config.name.replace(/[\s<>\:"\\\/\?\*\|]/g, "~")}-${processor.module?.name?.replace(" ", "_")}-${processor.module?.moduleId?.substring(0,8)}.json`;
			fs.writeFileSync( outPath, JSON.stringify(processor.module?.toDto(), null, "\t"));
			action( `Patched module written to ${outPath}` );
		})
		.catch(ex => error("Error: " + ex));


}

function getConfig(configPath?: string, configName?: string): IRhinoSpectConfig {
	let jsonPath;
	if (configPath) {
		jsonPath = configPath;
	}
	else {
		jsonPath = path.join(__dirname, '..', 'rhinospect.conf.json');
	}

	let config: IRhinoSpectConfig | undefined;
	try {
		var jsonString = fs.readFileSync(jsonPath, 'utf8');
		var configFileObj: IRhinoSpectConfigList = JSON.parse(jsonString);
		config = configFileObj.publishConfigurationList.find(v => v.name == (configName ?? "default"));
	}
	catch (ex) {
		
		const errorMessage = (ex instanceof Error) ? ex.message : ex;

		fatal(`There was an error reading the configuration file.  Please ensure that you either specify a file path, or have a rhinospect.conf.json in your project's root folder.  Error: ${errorMessage}`);
	}

	if (!config) {
		throw (`The specified config section could not be found, or there is no default configuration.\nUnable to find "${(configName ?? "default")}" in "${path.resolve(jsonPath)}"`);
	}

	return config;

}

function patchClasses( config: IRhinoSpectConfig, processor: ModuleProcessor ): Promise<void>[] {
	
	const promiseList: Promise<void>[] = [];

	config.classMap.map(v => {

		const reader = new SourceReader();

		if (v.templateFilePath == undefined) {
			throw Error("No templateFilePath found in the config.");
		}

		if (v.patchList == undefined) {
			throw Error("No patchList found in the config.");
		}

		action(`Loading template file for ${v.className}`);

		const patcher = new FilePatcher(v.templateFilePath);

		v.patchList.map(p => {
			action(`Loading patch file for ${p.key}`);
			patcher.applyPatch(p);
			success(`Patch successfull for ${p.key}`);
		});

		success(`All class patches applied`);

		const patchedTemplate = patcher.patchedContent;

		//fs.writeFileSync( `./patched-${v.className}.json`, patchedTemplate);

		action(`Checking that the patched template is valid JSON`);
		const templateObj = JSON.parse(patchedTemplate);
		success(`Template is valid JSON`);
		
		action(`Retrieving module from server, and patching ${v.className} class`);

		//Ensure that the relevant properties are strings
		if( typeof templateObj.icon !== "string" ) 
			templateObj.icon = JSON.stringify(templateObj.icon);

		if( typeof templateObj.source.css !== "string" )
			templateObj.source.css = JSON.stringify(templateObj.source.css);

		if( typeof templateObj.source.html !== "string" )
			templateObj.source.html = JSON.stringify(templateObj.source.html);

		if( typeof templateObj.source.javascript !== "string" )
			templateObj.source.javascript = JSON.stringify(templateObj.source.javascript);
		
		promiseList.push(processor.patchClass(v, templateObj));
		
	});

	return promiseList;
}

function patchModule( config: ITemplateAndPatch, processor: ModuleProcessor ): 
	Promise<void> {

	if (config.templateFilePath == undefined) {
		throw Error("No module templateFilePath found in the config.");
	}

	if (config.patchList == undefined) {
		throw Error("No module patchList found in the config.");
	}

	action(`Loading template file for module attributes`);

	const patcher = new FilePatcher(config.templateFilePath);
	
	config.patchList.map(p => {
		action(`Loading patch for ${p.key}`);
		patcher.applyPatch(p);
		success(`Patch successfull for ${p.key}`);
	});

	success(`All module attribute patches applied`);

	const patchedTemplate = patcher.patchedContent;

	action(`Checking that the patched template is valid JSON`);
	const templateObj = JSON.parse(patchedTemplate);
	success(`Template is valid JSON`);

	//Ensure that the relevant properties are strings
	if( typeof templateObj.applets !== "string" )
		templateObj.applets = JSON.stringify(templateObj.applets);

	return processor.patchModule(templateObj);
}