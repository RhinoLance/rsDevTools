export interface IClassPatchPayload {
	template?: string,			// the class template
	mapFeatures?: string,		// the map features
	html?: string,				// the html content
	css?: string,				// the css content
	javascript?: string,		// the javascript content
	clusterRenderer?: string,	// the cluster renderer content
	pointRenderer?: string,		// the point renderer content
	source?: string,			// the source content
	layers?: string				// the layers content
}