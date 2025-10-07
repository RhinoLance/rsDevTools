export declare class TranspileProcessor {
    constructor();
    processHtml(source: string, version?: string): string;
    processScss(source: string, version?: string): string;
    processTs(source: string, version?: string): string;
    cleanImportStatements(tsSrc: string): string;
    cleanExportClassStatements(jsSrc: string): string;
    cleanEmptyExportStatements(jsSrc: string): string;
    insertVersion(template: string, fileType: string, version?: string): string;
}
