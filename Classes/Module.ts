//export namespace RhinoSpect {

	export class Module {
		public moduleId?: string;
		public name?: string;
		public password?: string;
		public created?: Date;
		public modified?: Date;
		public deleted?: boolean;
		public definition?: IClassDefinition[];
		public mapFeatures?: IMapFeatures[];
		public colour?: string;
		public archiveAge?: number;

		constructor( record?: IModuleDto ){

			if( record ){
				this.fromDto(record);
			}

		}

		public fromDto(record: IModuleDto){
			Object.assign( this, record );
			this.modified = new Date(record.modified);
			this.created = new Date(record.created);

			try{
				this.definition = JSON.parse(record.definition ?? []);
			}
			catch(ex){
				throw( "Module definition is invalid.  Inner exception: " + ex.message);
			}

			try{
				this.mapFeatures = JSON.parse(record.mapFeatures ?? []);
			}
			catch(ex){
				throw( "Module definition is invalid.  Inner exception: " + ex.message);
			}
		}

		public toDto(): IModuleDto{
			const record: IModuleDto = <IModuleDto><unknown>Object.assign( {}, this );
			record.modified = this.modified?.toISOString() ?? new Date().toISOString();
			record.created = this.created?.toISOString() ?? new Date().toISOString();
			record.definition = JSON.stringify(this.definition ?? []);
			record.mapFeatures = JSON.stringify(this.mapFeatures ?? []);

			return record;
		}
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

	export interface IMapFeatures {

	}

	export interface IClassDefinition {
		name: string,
		id: string,
		type: FormType,
		icon: string,
		statusDef: IStatusDef[],
		ratingDef: IRatingDef[],
		fieldList: {
			id: string,
			display: string,
			type: string,
			placeholder: string,
			required: boolean,
			valueList: any[],
			valueListText: string[]
		}[],
		source: {
			mode: string,
			html: string,
			javascript: string,
			css: string
		}

	}

	export enum FormType {
		wizard, source
	}

	export interface IStatusDef {
		value: number,
		text: string,
		colour: string
	}

	export interface IRatingDef {
		value: number,
		text: string,
		colour: string
	}

	export enum Permissions {
		None = 0,
		Read = 1,
		Write = 0x2,
		ModuleEdit = 4,
		Security = 8
	}


//}