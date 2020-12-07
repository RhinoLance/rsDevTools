export interface IRhinoSpectConfigList {
	publishConfigurationList: IRhinoSpectConfig[]
}

export interface IRhinoSpectConfig {
	
	name: string,
	url: string,
	token: string,
	moduleId: string,
	componentMap: [
		{
			classId: string
			componentName: string,
			sourceFolder: string,
		}
	]
}