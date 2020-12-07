import { IRhinoSpectConfig } from "./IRhinoSpectConfigList";
import { ISourceFormParts } from "./ISourceFormParts";
import { ApiService } from "./RhinoSpect.Api"
import { Module } from "./Module";

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

	public updateClass( classId: string, sourceParts: ISourceFormParts ): Promise<void>{

		return this.getModule()
			.then( module => {
				
				const cls = module.definition?.find(v=> v.id == classId);
				if( !cls ){
					throw( "Class not found with ID: " + classId);
				}

				cls.source.css = sourceParts.css;
				cls.source.html = sourceParts.html;
				cls.source.javascript = sourceParts.javascript;

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