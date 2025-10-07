export interface IRhinoSpectConfigList {
    publishConfigurationList: IRhinoSpectConfig[];
}
export interface IRhinoSpectConfig {
    name: string;
    url: string;
    serverName: string;
    token: string;
    moduleId: string;
    mapFeatureFilePath?: string;
    classMap: IRhinoSpectClassMap[];
    moduleAttributes?: ITemplateAndPatch;
}
export interface IRhinoSpectClassMap {
    className: string;
    classId: string;
    componentName: string;
    sourceFolder: string;
    templateFilePath?: string;
    patchList?: IRhinoSpectFilePatch[];
}
export interface ITemplateAndPatch {
    templateFilePath?: string;
    patchList?: IRhinoSpectFilePatch[];
}
export interface IRhinoSpectClassTemplate {
    type?: "source" | "wizard";
    icon?: string;
    statusDef?: {
        value: number;
        text: string;
        colour: string;
    }[];
    ratingDef?: {
        value: number;
        text: string;
        colour: string;
    }[];
    ratingDefId?: "custom" | "MajorModerateMinor" | "bears";
    source?: {
        html: string;
        javascript: string;
        css: string;
    };
}
export interface IRhinoSpectFilePatch {
    key: string;
    filePath: string;
    replaceWithValue?: string;
    stringify?: boolean;
    strippedStringify?: boolean;
}
