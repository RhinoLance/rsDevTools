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

		let patchFile = this._sourceReader.getFileContents(patch.filePath);
		if( patch.stringify === true ){
			patchFile = JSON.stringify(patchFile);
		}

		this._patchedContent = this._patchedContent.replace(patch.key, patchFile);

	}
}