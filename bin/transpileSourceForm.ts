#!/usr/bin/env node 

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import * as sass from "node-sass";


let targetFile: string = "123";
const emojis = {
	happy: "🙂",
	skull: "☠️",
	fire: "🔥"
}

type Processor = (build:string, targetFile: string) => Promise<boolean>;

var program = new Command("transpileSourceForm <targetFile>")
		.version( "1.0.0" )
		.arguments('<targetFile>')
		.action( target => targetFile = target )
		.option( "-t --type [type]", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
		.option( "-nt --no-tag", "Do not 'git tag' this version")
		.parse(process.argv);

function main(source: string ) {

	switch( path.extname( source )) {
		case ".ts":
			processTs( source );
			break;
		case ".scss":
			processScss(source);
			break
		default:
			processTs( source + ".ts" );
			processScss(source + ".scss");

	}
	

}

function processScss(source: string) {
	
	const outputPath = path.join(path.dirname(source), path.basename(source, ".scss")) + "-formReady.css";

	sass.render( {
		file: source,
		outFile: outputPath
	}, (err, result)=> {
		if( err ) {
			targetError(source);
			return;
		}
		fs.writeFile(outputPath, result.css, err => {
			if(err) {
				error( "The transpiled file could not be written.");
				return;
			}
			success(path.basename(source) + " was succesfully transpiled.");
		});
	});
}

function processTs(source: string) {
	
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

		const outputPath = path.join(path.dirname(source), path.basename(source, ".ts")) + "-formReady.js";
		fs.writeFile(outputPath, transpiled, function(err) {
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
main( targetFile );
}
catch( error ){
	console.error( chalk.redBright( "\nERROR: " + error + "\n" ));
	process.exit(1);
}