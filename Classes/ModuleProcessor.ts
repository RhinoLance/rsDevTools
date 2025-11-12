import { IRhinoSpectClassMap, IRhinoSpectConfig } from "./IRhinoSpectConfigList";
import { ISourceFormParts } from "./ISourceFormParts";
import { ApiService } from "./RhinoSpect.Api"
import { IClassDefinition, IMapFeature, Module } from "./Module";

export class ModuleProcessor {

	public module?: Module;

	private apiSvc: ApiService;
	private config: IRhinoSpectConfig;
	private modulePromise?: Promise<Module>;
	
	constructor( config: IRhinoSpectConfig ){
		this.config = config;
		this.apiSvc = new ApiService(config.url, config.token);
	}

	private getModule(): Promise<Module> {

		return this.modulePromise ?? (this.modulePromise = this.apiSvc.getModule(this.config.moduleId)
			.then( dto => {
				this.module = new Module(dto);
				return this.module;
			})
			.catch( err => {
				throw( `RhinoSpect module could not be retrieved for ${this.config.moduleId}.\nError: ${err}`);
			}));

	}

	public updateClass( classMap: IRhinoSpectClassMap, sourceParts?: ISourceFormParts, template?: IClassDefinition ): Promise<void>{

		return this.getModule()
			.then( module => {

				let modClass = module.definition?.find(v=> v.id == classMap.classId);

				if( template ){
					if( modClass == undefined){
						modClass = template;
						module.definition?.push(template);
					}
					else{
						Object.assign(modClass, template);
					}
				}
				else{
					if( modClass == undefined){
						throw( `A class definition could not be found as either a template or the server's module for "${classMap.className}"`);
					}
				}

				modClass.id = classMap.classId;
				modClass.name = classMap.className;

				if( sourceParts ) {
					modClass.source.css = sourceParts.css;
					modClass.source.html = sourceParts.html;
					modClass.source.javascript = sourceParts.javascript;
				}

				return;
			}
		)
	}

	public patchClass( classMap: IRhinoSpectClassMap, template: IClassDefinition ): Promise<void>{

		return this.updateClass( classMap, undefined, template );
	}

	public patchModule( template: IClassDefinition ): Promise<void>{

		return this.getModule()
			.then( module => {

				Object.assign(module, template);

				return;
			}
		)
	}

	public updateMapFeatures( mapFeatures: IMapFeature[] ): Promise<string>{

		if( !mapFeatures ){
			throw Error("No map features were provided");
		}

		return this.getModule()
			.then( module => {

				module.mapFeatures = mapFeatures;

				const length = JSON.stringify(mapFeatures).length;
				const lengthStr = length > 1000 ? `${(length/1000).toFixed(1)} kB` : `${length} B`;
				const names = mapFeatures.map(v=> v.name).join(", ");

				return `Added ${mapFeatures.length} map features (${lengthStr}): ${names}`;
			}
		)
	}

	public pushModuleToServer(): Promise<void> {

		if( !this.module ){
			throw("No module has been retrieved to push");
		}

		return this.apiSvc.saveModule( this.module.toDto() )

	}
}