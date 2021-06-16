export interface IRhinoSpectConfigList {
	publishConfigurationList: IRhinoSpectConfig[]
}

export interface IRhinoSpectConfig {

	name: string,
	url: string,
	token: string,
	moduleId: string,
	classMap: IRhinoSpectClassMap[]
}

export interface IRhinoSpectClassMap {
	className: string,
	classId: string,
	componentName: string,
	sourceFolder: string,
	templateFilePath: string,
}