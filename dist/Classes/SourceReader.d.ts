import { ISourceFormParts } from './ISourceFormParts';
export declare class SourceReader {
    private srcRoot;
    constructor(folderPath?: string);
    getSourceParts(componentName: string): ISourceFormParts;
    getFileContents(filePath: string): string;
}
