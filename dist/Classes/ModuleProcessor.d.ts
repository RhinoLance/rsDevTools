import { IRhinoSpectClassMap, IRhinoSpectConfig } from "./IRhinoSpectConfigList";
import { ISourceFormParts } from "./ISourceFormParts";
import { IClassDefinition, IMapFeature, Module } from "./Module";
export declare class ModuleProcessor {
    module?: Module;
    private apiSvc;
    private config;
    private modulePromise?;
    constructor(config: IRhinoSpectConfig);
    private getModule;
    updateClass(classMap: IRhinoSpectClassMap, sourceParts?: ISourceFormParts, template?: IClassDefinition): Promise<void>;
    patchClass(classMap: IRhinoSpectClassMap, template: IClassDefinition): Promise<void>;
    patchModule(template: IClassDefinition): Promise<void>;
    updateMapFeatures(mapFeatures: IMapFeature[]): Promise<string>;
    pushModuleToServer(): Promise<void>;
}
