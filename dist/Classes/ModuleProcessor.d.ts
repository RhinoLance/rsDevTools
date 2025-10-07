import { IRhinoSpectClassMap, IRhinoSpectConfig } from "./IRhinoSpectConfigList";
import { ISourceFormParts } from "./ISourceFormParts";
import { IClassDefinition, IMapFeature } from "./Module";
export declare class ModuleProcessor {
    private apiSvc;
    private config;
    private modulePromise?;
    private module?;
    constructor(config: IRhinoSpectConfig);
    private getModule;
    updateClass(classMap: IRhinoSpectClassMap, sourceParts: ISourceFormParts, template?: IClassDefinition): Promise<void>;
    patchClass(classMap: IRhinoSpectClassMap, template: IClassDefinition): Promise<void>;
    patchModule(template: IClassDefinition): Promise<void>;
    updateMapFeatures(mapFeatures: IMapFeature[]): Promise<string>;
    pushModuleToServer(): Promise<void>;
}
