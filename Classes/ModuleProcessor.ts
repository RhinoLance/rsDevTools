import { IRhinoSpectClassMap, IRhinoSpectConfig } from "./IRhinoSpectConfigList";
import { ISourceFormParts } from "./ISourceFormParts";
import { ApiService } from "./RhinoSpect.Api"
import { IClassDefinition, IModuleDto, Module } from "./Module";

export class ModuleProcessor {

	private apiSvc: ApiService;
	private config: IRhinoSpectConfig;
	private modulePromise?: Promise<Module>;
	private module?: Module;

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

	public updateClass( classMap: IRhinoSpectClassMap, sourceParts: ISourceFormParts, template?: IClassDefinition ): Promise<void>{

		return this.getModule()
			.then( module => {

				let modClass = module.definition?.find(v=> v.id == classMap.classId);

				if( template ){
					if( modClass == undefined){
						module.definition?.push(template);
						modClass = template;
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

				Object.assign(modClass, template);



				modClass.source.css = sourceParts.css;
				modClass.source.html = sourceParts.html;
				modClass.source.javascript = sourceParts.javascript;

				return;
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