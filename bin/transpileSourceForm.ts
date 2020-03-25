#!/usr/bin/env node 

import { Command } from "commander";
import chalk from "chalk";
import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";


let targetFile: string = "123";

type Processor = (build:string, targetFile: string) => Promise<boolean>;

var program = new Command("transpileSourceForm <targetFile>")
		.version( "1.0.0" )
		.arguments('<targetFile>')
		.action( target => targetFile = target )
		.option( "-t --type [type]", "Specify the type of file to update [ts, html, scss].  If not specified it will transpile all files which match the given targetFile.")
		.option( "-nt --no-tag", "Do not 'git tag' this version")
		.parse(process.argv);

function main(target: string ) {

	fs.readFile( target, 'utf8', (err, data)=> {
		if( err ) {
			targetError();
			return;
		}

		const start = data.indexOf("class");
		const classString = data.substring(start);

		const transpiled = ts.transpileModule(classString, 
			{ compilerOptions: 
				{ 
					module: ts.ModuleKind.ES2015,
					target: ts.ScriptTarget.ES2016
				}
			}).outputText;

		const outputPath = path.join(path.dirname(target), path.basename(target, ".ts")) + "-formReady.js";
		fs.writeFile(outputPath, transpiled, function(err) {
			if(err) {
				error( "The transpiled file could not be written to: " + outputPath);
				return;
			}
			console.log("The file was succesfully transpiled to " + outputPath);
		}); 
	});
	

}

function targetError() {
	console.error( chalk.redBright( "The specified target file could not be found"));
	process.exit(1);
}

function error(message: string){
	console.error( chalk.redBright( message ));
	process.exit(1);
}

try{
main( targetFile );
}
catch( error ){
	console.error( chalk.redBright( "\nERROR: " + error + "\n" ));
	process.exit(1);
}