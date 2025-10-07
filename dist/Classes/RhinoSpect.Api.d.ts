import { IModuleDto } from "./Module";
export declare class ApiService implements IApiService {
    private readonly API_VERSION_PATH;
    private apiUrl;
    private readonly TIMEOUT;
    constructor(server: string, token: string);
    getModuleList(): Promise<IModuleDto[]>;
    getModule(moduleId: string): Promise<IModuleDto>;
    saveModule(moduleDto: IModuleDto): Promise<void>;
    getUser(userId: string): Promise<ApiService.IUser>;
    getModuleUser(moduleId: string, userId: string): Promise<ApiService.IModuleUser>;
    setModuleUser(data: ApiService.IModuleUser): Promise<ApiService.IModuleUser>;
    private buildUrl;
    private getFromRsApi;
    get(url: string): Promise<any>;
    private postToRsApi;
    private putToRsApi;
    put(url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<any>;
    post(url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<any>;
    putPost(operation: string, url: string, data: any, config?: ApiService.IHttpOptions, noToken?: boolean): Promise<void>;
}
export interface IApiService {
    getModuleList(): Promise<IModuleDto[]>;
    getModule(moduleId: string): Promise<IModuleDto>;
    saveModule(moduleDto: IModuleDto): Promise<void>;
    getUser(userId: string): Promise<ApiService.IUser>;
    getModuleUser(moduleId: string, userId: string): Promise<ApiService.IModuleUser>;
    setModuleUser(data: ApiService.IModuleUser): Promise<ApiService.IModuleUser>;
}
export declare namespace ApiService {
    enum HttpStatus {
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
    interface IHttpOptions {
        headers: [];
        observe?: any;
    }
    interface IHttpResponse {
        status: number;
        data: any;
    }
    interface IModuleSyncIndex {
        moduleId: string;
        inspectionModified: number;
        activityModified: number;
        mediaModified: number;
        modUserModified: number;
        archiveAge: number;
    }
    interface IUser {
        userId: string;
        email: string;
        realName: string;
        notes: string;
        password: string;
    }
    interface IModuleUser {
        moduleId: string;
        userId: string;
        permissions: number;
        email: string;
        description: string;
    }
}
