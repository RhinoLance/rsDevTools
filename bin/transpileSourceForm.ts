#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import * as sass from "sass";


let targetFile: string = "123";
let formVersion: string = "";
const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

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

function main(source: string, version: string = "" ) {

	switch( path.extname( source )) {
		case ".ts":
			processTs( source, formVersion );
			break;
		case ".scss":
			processScss(source, formVersion);
			break
		case ".html":
			processHtml(source, formVersion);
			break
		default:
			processTs( source + ".ts", formVersion );
			processScss(source + ".scss", formVersion);
			processHtml(source + ".html", formVersion);

	}


}

function processHtml(source: string, version: string) {

	const outputPath = path.join(path.dirname(source), path.basename(source, ".html")) + "-formReady.html";

	fs.readFile( source, 'utf8', (err, data)=> {
		if( err ) {
			targetError(source);
			return;
		}

		const output = getVersionComment(version, "html") + data;

		fs.writeFile(outputPath, output, function(err) {
			if(err) {
				error( "The transpiled file could not be written.");
				return;
			}
			success(path.basename(source) + " was succesfully transpiled.");
		});
	});
}

function processScss(source: string, version: string) {

	const outputPath = path.join(path.dirname(source), path.basename(source, ".scss")) + "-formReady.css";

	sass.render( {
		file: source,
		outFile: outputPath
	}, (err, result)=> {
		if( err ) {
			targetError(source);
			return;
		}

		const output = getVersionComment(version, "css") + result.css;

		fs.writeFile(outputPath, output, err => {
			if(err) {
				error( "The transpiled file could not be written.");
				return;
			}
			success(path.basename(source) + " was succesfully transpiled.");
		});
	});
}

function processTs(source: string, version: string) {

	fs.readFile( source, 'utf8', (err, data)=> {
		if( err ) {
			targetError(source);
			return;
		}

		const start = data.indexOf("class");
		const classString = data.substring(start);

		let transpiled = ts.transpileModule(classString,
			{ compilerOptions:
				{
					module: ts.ModuleKind.ES2015,
					target: ts.ScriptTarget.ES2016
				}
			}).outputText;

			transpiled = cleanExportClassStatements(transpiled);
			transpiled = cleanEmptyExportStatements(transpiled);

		const output = getVersionComment(version, "js") + transpiled;

		const outputPath = path.join(path.dirname(source), path.basename(source, ".ts")) + "-formReady.js";
		fs.writeFile(outputPath, output, function(err) {
			if(err) {
				error( "The transpiled file could not be written.");
				return;
			}
			success(path.basename(source) + " was succesfully transpiled.");
		});
	});
}

function cleanExportClassStatements(jsSrc: string): string {
	return jsSrc.replace(/export class/g, "class")
}

function cleanEmptyExportStatements(jsSrc: string): string {
	return jsSrc.replace(/export {};/g, "")
}

function getVersionComment(version: string, fileType: string){

	if( !version ){
		return "";
	}

	let template: string = "";

	switch( fileType ){
		case "html":
			template = "<!-- PLACEHOLDER -->";
			break;
		case "css":
		case "js":
		case "ts":
			template = "/* PLACEHOLDER */";
	}

	const output = template.replace("PLACEHOLDER", `Version: ${version}`);
	return output + "\n\n";

}

function targetError( source: string) {
	console.error( emojis.fire + " " + chalk.redBright( "The specified target file could not be found at " + source));
	process.exit(1);
}



function success(message: string) {
    console.log(emojis.happy + " " + chalk.greenBright( message ));
}

function error(message: string){
	console.error( emojis.fire + " " + chalk.redBright( message ));
	process.exit(1);
}

try{
	main( targetFile, formVersion );
}
catch( error ){
	console.error( chalk.redBright( "\nERROR: " + error + "\n" ));
	process.exit(1);
}