import {IModuleDto} from "./Module";
import fetch from 'node-fetch';


export class ApiService {

	private readonly API_VERSION_PATH: string = "/api/2.0";

	private apiUrl = "";

	private readonly TIMEOUT = 1000 * 15; //15 seconds

	constructor( server: string, token: string ){
		this.apiUrl = server.replace(/\/$/, "") + `${this.API_VERSION_PATH}/${token}/`;
	}

	public getModuleList() :Promise<IModuleDto[]> {
		return this.getFromRsApi<IModuleDto[]>( "modules/", "");
	}

	public getModule( moduleId: string ) : Promise<IModuleDto> {
		return this.getFromRsApi<IModuleDto>( `modules/${moduleId}`, "");
	}

	public saveModule(moduleDto: IModuleDto): Promise<void> {
		
		return this.putToRsApi(`modules/${moduleDto.moduleId}`, moduleDto);
		
	};

	private buildUrl(urlSuffix: string, querystring?: string, allowCache: boolean = false) {
		
		if( this.apiUrl === "") throw( "ApiService: No API URL set");

		let url = this.apiUrl;
		url += urlSuffix;
		url += allowCache ? '?a=b' : '?noCache=' + Math.floor(Math.random() * 100000000);
		url += (querystring || '');
		
		return url;
	};

	private getFromRsApi<T>(urlSuffix: string, querystring?: string, config?: ApiService.IHttpOptions) :  Promise<T> {

		let url = this.buildUrl( urlSuffix, "" );

		return this.get(url);
	};

	public get(url: string) :  Promise<any> {
		
		console.log( `Retrieving ${url}` );

		return fetch(url)
			.then((response: any) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				
				return response.json()
			})
			.catch( err => {
				console.log( err );
			});
	}

	private postToRsApi(urlSuffix: string, data: any, config?: ApiService.IHttpOptions):  Promise<any> {
		let url = this.buildUrl( urlSuffix, "" );
		return this.post(url, data )
	}

	private putToRsApi(urlSuffix: string, data: any, config?: ApiService.IHttpOptions):  Promise<any> {
		let url = this.buildUrl( urlSuffix, "" );
		return this.put(url, data )
	}

	public put( url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<any> {
		return this.putPost("put", url, data, config, noToken);
	}

	public post( url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<any> {
		return this.putPost("post", url, data, config, noToken);
	}

	public putPost(operation: string, url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<void> {
		
		console.log( `${operation}ting ${url}` );

		return fetch(url, {
			method: operation,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
			})
			.then((response: any) => {
				if (!response.ok) {
					throw new Error(`Put failed: ${response.status}: ${response.statusText}`);
				}
				
				return;
			});
	}
}

export namespace ApiService {
	export enum HttpStatus {
		ZERO = 0,
		OK = 200,
		NOT_MODIFIED = 304,
		BAD_REQUEST = 400,
		UNAUTHORIZED = 401,
		FORBIDDEN = 403,
		NOT_FOUND = 404,
		CONNECTION_TIMEOUT = 408,
		CONFLICT = 409,
		SERVER_ERROR = 500
	}

	export interface IHttpOptions {
		headers: [],
		observe?: any
	}

	export interface IHttpResponse {
		status: number,
		data: any
	}

	export interface IModuleSyncIndex {
		moduleId: string,
		inspectionModified: number,
		activityModified: number,
		mediaModified: number,
		modUserModified: number,
		archiveAge: number
	}

	export interface ICreateUser {
		email: string,
		realName: string,
		notes: string,
		password: string
	}

	export interface ICreateModuleUser {
		moduleId: string,
		userId: string,
		permissions: number,
		email: string,
		description: string
	}

}