import * as fs from 'fs';
import * as path from 'path';
import * as ts from "typescript";
import * as sass from "sass";
import chalk from "chalk";


export class TranspileProcessor {

	constructor(){}

	public processHtml(source: string, version?: string): string {

		return this.insertVersion(source, "html", version);
	}

	public processScss(source: string, version?: string): string {

		let css: string;
		try{
			css = sass.renderSync( {data: source} ).css.toString();
		}
		catch(ex){
			throw( `There was an error transpiling ${path.basename(source, ".scss")}.  ${ex}`)
		}

		css = this.insertVersion(css, "css", version);

		return css;
	}

	public processTs(source: string, version?: string) {

		const start = source.indexOf("class");
		let truncated = source.substring(start);

		truncated = this.cleanImportStatements(truncated);


		let transpiled: string;
		try{
			transpiled = ts.transpileModule(truncated,
			{ compilerOptions:
				{
					module: ts.ModuleKind.ES2015,
					target: ts.ScriptTarget.ES2016
				}
			}).outputText;

		}
		catch(ex){
			throw( `There was an error transpiling typescript ${path.basename(source, ".ts")}.  ${ex}`)
		}

		transpiled = this.cleanExportClassStatements(transpiled);
		transpiled = this.cleanEmptyExportStatements(transpiled);
		transpiled = this.insertVersion(transpiled, "js", version);

		return transpiled;
	}

	public cleanImportStatements(tsSrc: string): string {
		return tsSrc.replace(/^import.*$;/g, "")
	}

	public cleanExportClassStatements(jsSrc: string): string {
		return jsSrc.replace(/export class/g, "class")
	}

	public cleanEmptyExportStatements(jsSrc: string): string {
		return jsSrc.replace(/export {};/g, "")
	}

	public insertVersion(template: string, fileType: string, version?: string): string{

		if( !version ){
			return template;
		}

		let comment: string = "";

		switch( fileType ){
			case "html":
				comment = "<!-- Version: VERSION_PLACEHOLDER -->";
				break;
			case "css":
			case "js":
			case "ts":
				comment = "/* Version: VERSION_PLACEHOLDER */";
		}

		let output = comment + "\n\n" + template;
		output = output.replace(/VERSION_PLACEHOLDER/g, `${version}`);

		return output;

	}
}