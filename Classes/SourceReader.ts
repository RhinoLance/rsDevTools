import * as fs from 'fs';
import * as path from 'path';
import { ISourceFormParts } from './ISourceFormParts';

export class SourceReader {

	private srcRoot = "folderPath";

	constructor( folderPath: string = "" ){
		this.srcRoot = folderPath;
	}

	public getSourceParts( componentName: string ): ISourceFormParts {

		const output: ISourceFormParts = <ISourceFormParts><unknown>{};
		const srcPath = path.resolve(this.srcRoot, `${componentName}-formReady`);

		output.css = this.getFileContents(`${srcPath}.css`);
		output.html = this.getFileContents(`${srcPath}.html`);
		output.javascript = this.getFileContents(`${srcPath}.js`);

		return output;
	}

	public getFileContents(filePath: string): string {

		try{
			return fs.readFileSync(filePath, 'utf8');
		}
		catch(ex) {
			const fullPath = path.resolve(filePath);
			const message = `Could not read file at "${fullPath}"`;
			throw Error(message);
		}

	}

}