export declare class Module {
    moduleId?: string;
    name?: string;
    password?: string;
    created?: Date;
    modified?: Date;
    deleted?: boolean;
    definition?: IClassDefinition[];
    mapFeatures?: IMapFeature[];
    colour?: string;
    archiveAge?: number;
    constructor(record?: IModuleDto);
    fromDto(record: IModuleDto): void;
    toDto(): IModuleDto;
}
export interface IModuleDto {
    moduleId: string;
    userId: string;
    name: string;
    password: string;
    created: string;
    modified: string;
    deleted: boolean;
    definition: string;
    mapFeatures: string;
    colour: string;
    archiveAge: number;
}
export interface IMapFeature {
    name: string;
}
export interface IClassDefinition {
    name: string;
    id: string;
    type: FormType;
    icon: string | IMarkerDef;
    statusDef: IStatusDef[];
    ratingDef: IRatingDef[];
    fieldList: {
        id: string;
        display: string;
        type: string;
        placeholder: string;
        required: boolean;
        valueList: any[];
        valueListText: string[];
    }[];
    source: {
        mode: string;
        html: string;
        javascript: string;
        css: string;
    };
}
export interface IMarkerDef {
    clusterRenderer?: string;
    pointRenderer?: string;
    source?: string;
    layers?: string;
}
export declare enum FormType {
    wizard = 0,
    source = 1
}
export interface IStatusDef {
    value: number;
    text: string;
    colour: string;
}
export interface IRatingDef {
    value: number;
    text: string;
    colour: string;
}
export declare enum Permissions {
    None = 0,
    Read = 1,
    Write = 2,
    ModuleEdit = 4,
    Security = 8
}
