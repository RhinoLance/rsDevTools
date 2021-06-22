#!/usr/bin/env node

import { Command } from "commander";
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import * as sass from "sass";
import chalk from "chalk";
import { TranspileProcessor } from "../Classes/TranspileProcessor";

const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

let targetFile: string = "123";
let formVersion: string = "";


var program = new Command("transpileSourceForm <targetFile> [version]")
	.version( "1.0.0" )
	.arguments('<targetFile> [version]')
	.action( (target, version) => {
		targetFile = target;
		formVersion = version || "";
	})
	.option( "-t --type <string>", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
	.option( "-nt --no-tag", "Do not 'git tag' this version")
	.parse(process.argv);

try{
	main( targetFile, formVersion );
}
catch( error ){
	displayError( "\nERROR: " + error + "\n" );
	process.exit(1);
}

function main(source: string, version: string = "" ) {

	const tp = new TranspileProcessor();

	switch( path.extname( source )) {
		case ".ts":
			processFile( source, formVersion, tp.processTs );
			break;
		case ".scss":
			processFile(source, formVersion, tp.processScss);
			break
		case ".html":
			processFile(source, formVersion, tp.processHtml);
			break
		default:
			processFile( source + ".ts", formVersion, tp.processTs );
			processFile(source + ".scss", formVersion, tp.processScss);
			processFile(source + ".html", formVersion, tp.processHtml);
	}

}

function processFile(source: string, version: string, fProcessor: (template: string, version: string)=>string) {

	const extMap = new Map([
		[".scss", ".css"],
		[".sass", ".css"],
		[".html", ".html"],
		[".ts", ".js"]
	]);

	const ext = extMap.get(path.extname( source ).toLowerCase());

	const outputPath = path.join(path.dirname(source), path.basename(source, ext)) + `-formReady${ext}`;

	const src = readFile(source);
	const output = fProcessor(src, version);
	writeFile(outputPath, output);

}

function displaySuccess(message: string) {
	console.log(emojis.happy + " " + chalk.greenBright( message ));
}

function displayError(message: string){
	console.error( emojis.fire + " " + chalk.redBright( message ));
	process.exit(1);
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

function writeFile( filePath: string, data: string ): void {
	try{
		fs.writeFileSync(filePath, data);
	}
	catch(ex) {
		throw( `The transpiled file could not be written to ${filePath}`);
	}
}

