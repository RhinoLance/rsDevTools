export interface IRhinoSpectConfigList {
	publishConfigurationList: IRhinoSpectConfig[]
}

export interface IRhinoSpectConfig {

	name: string,	// the name of the configuration section
	url: string,	// the RhinoSpect server installation.  When using the public Rhinospect server, this will be "https://go.rhinospect.com/"
	token: string,	// a security token used to access the server in the form of a Guid
	moduleId: string,	// the RhinoSpect module ID to target in the form of a Guid
	mapFeatureFilePath?: string, 	// a filepath to a JSON file containing map features to be uploaded.
	classMap: IRhinoSpectClassMap[]	// an array of classes, and the settings to set.
}

export interface IRhinoSpectClassMap {
	className: string,	// the name of the class
	classId: string,	// the ID of the class.  Where a class with this id is found, it will update it, otherwise insert a new class
	componentName: string,	// files with the name of <componentName>-formReady.[css|html|js] will be used as the class source
	sourceFolder: string,	// the folder to look for the source files
	templateFilePath?: string,	// the path to a class template file which defines non-form related class values.
}

export interface IRhinoSpectClassTemplate {

	type?: "source"|"wizard",	//Form type.  For custom forms this will amost always be "source"
	icon?: string,				// the icon definition
	statusDef?: {
		value: number,			// the status value
		text: string,			// the display for the status
		colour: string,			// the status colour
	}[],
	ratingDef?: {
		value: number,			// the rating value
		text: string,			// the display for the rating
		colour: string			// the rating colour
	}[],
	ratingDefId?: "custom"|"MajorModerateMinor"|"bears",  // when edited, the pre-configured rating to display
	source?: {
		html: string,			// the custom html
		javascript: string,		// the custom javascript
		css: string				// the custom css
	}

}