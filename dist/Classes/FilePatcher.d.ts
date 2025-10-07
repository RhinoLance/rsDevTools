import { IRhinoSpectFilePatch } from "./IRhinoSpectConfigList";
export declare class FilePatcher {
    private _templatePath;
    get patchedContent(): string;
    private _patchedContent;
    private _sourceReader;
    constructor(_templatePath: string);
    applyPatch(patch: IRhinoSpectFilePatch): void;
    private patchWithValue;
    private patchWithFile;
}
