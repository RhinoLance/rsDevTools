import { IRhinoSpectFilePatch } from "./IRhinoSpectConfigList";
import { SourceReader } from "./SourceReader";

export class FilePatcher {

	public get patchedContent(): string {
		return this._patchedContent;
	}

	private _patchedContent: string = "";
	private _sourceReader = new SourceReader();

	constructor( private _templatePath: string ){
		this._patchedContent = this._sourceReader.getFileContents(_templatePath);
	}

	public applyPatch( patch: IRhinoSpectFilePatch ): void {

		if( patch.filePath != undefined ){
			this.patchWithFile(patch);
		}
		else if( patch.replaceWithValue != undefined ){
			this.patchWithValue(patch);
		}
	}

	private patchWithValue( patch: IRhinoSpectFilePatch ): void {
		this._patchedContent = this._patchedContent.replaceAll(patch.key, patch.replaceWithValue!);
	}

	private patchWithFile( patch: IRhinoSpectFilePatch ): void {
		
		let patchFile = this._sourceReader.getFileContents(patch.filePath);
		if( patch.stringify === true ){
			patchFile = JSON.stringify(patchFile);
		}

		if( patch.strippedStringify === true ){
			const patchString = JSON.stringify(patchFile);
			const stripped = patchString.substring(1, patchString.length - 1);
			patchFile = stripped;
		}

		this._patchedContent = this._patchedContent.replaceAll(patch.key, patchFile);
	}
}