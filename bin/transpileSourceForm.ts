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
let fileSuffix: string = "";


var program = new Command("transpileSourceForm <targetFile> <suffix> [version]")
	.version( "1.0.0" )
	.arguments('<targetFile> <suffix> [version]')
	.action( (target, suffix, version) => {
		targetFile = target;
		fileSuffix = suffix;
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

	switch( path.extname( source )) {
		case ".ts":
			processFile( source, formVersion, "processTs" );
			break;
		case ".scss":
			processFile(source, formVersion, "processScss");
			break
		case ".html":
			processFile(source, formVersion, "processHtml");
			break
		default:
			processFile( source + ".ts", formVersion, "processTs" );
			processFile(source + ".scss", formVersion, "processScss");
			processFile(source + ".html", formVersion, "processHtml");
	}

}

function processFile(source: string, version: string, processorName: "processTs" | "processHtml" | "processScss") {

	const extMap = new Map([
		[".scss", ".css"],
		[".sass", ".css"],
		[".html", ".html"],
		[".ts", ".js"]
	]);

	const ext = extMap.get(path.extname( source ).toLowerCase());
	const fileParts = path.parse(source);
	const outputPath = path.join(fileParts.dir, fileParts.name) + `${fileSuffix}${ext}`;

	const src = readFile(source);

	const tp = new TranspileProcessor();
	const output = tp[processorName](src, version);
	writeFile(outputPath, output);

	displaySuccess( `Transpile succesfull for ${outputPath}` );

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

