"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const node_fetch_1 = require("node-fetch");
class ApiService {
    constructor(server, token) {
        this.API_VERSION_PATH = "/api/2.0";
        this.apiUrl = "";
        this.TIMEOUT = 1000 * 15; //15 seconds
        this.apiUrl = server.replace(/\/$/, "") + `${this.API_VERSION_PATH}/${token}/`;
    }
    getModuleList() {
        return this.getFromRsApi("modules/", "");
    }
    getModule(moduleId) {
        return this.getFromRsApi(`modules/${moduleId}`, "");
    }
    saveModule(moduleDto) {
        return this.putToRsApi(`modules/${moduleDto.moduleId}`, moduleDto);
    }
    ;
    getUser(userId) {
        return this.getFromRsApi(`users/${userId}`, "");
    }
    ;
    getModuleUser(moduleId, userId) {
        return this.getFromRsApi(`modules/${moduleId}/users/${userId}`, "");
    }
    ;
    setModuleUser(data) {
        return this.putToRsApi(`modules/${data.moduleId}/users/${data.userId}`, data);
    }
    ;
    buildUrl(urlSuffix, querystring, allowCache = false) {
        if (this.apiUrl === "")
            throw ("ApiService: No API URL set");
        let url = this.apiUrl;
        url += urlSuffix;
        url += allowCache ? '?a=b' : '?noCache=' + Math.floor(Math.random() * 100000000);
        url += (querystring || '');
        return url;
    }
    ;
    getFromRsApi(urlSuffix, querystring, config) {
        let url = this.buildUrl(urlSuffix, "");
        return this.get(url);
    }
    ;
    get(url) {
        console.log(`Retrieving ${url}`);
        return node_fetch_1.default(url)
            .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .catch(err => {
            console.log(err);
        });
    }
    postToRsApi(urlSuffix, data, config) {
        let url = this.buildUrl(urlSuffix, "");
        return this.post(url, data);
    }
    putToRsApi(urlSuffix, data, config) {
        let url = this.buildUrl(urlSuffix, "");
        return this.put(url, data);
    }
    put(url, data, config, noToken) {
        return this.putPost("put", url, data, config, noToken);
    }
    post(url, data, config, noToken) {
        return this.putPost("post", url, data, config, noToken);
    }
    putPost(operation, url, data, config, noToken) {
        console.log(`${operation}ting ${url}`);
        return node_fetch_1.default(url, {
            method: operation,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error(`Put failed: ${response.status}: ${response.statusText}`);
            }
            return;
        });
    }
}
exports.ApiService = ApiService;
(function (ApiService) {
    let HttpStatus;
    (function (HttpStatus) {
        HttpStatus[HttpStatus["ZERO"] = 0] = "ZERO";
        HttpStatus[HttpStatus["OK"] = 200] = "OK";
        HttpStatus[HttpStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
        HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
        HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
        HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
        HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
        HttpStatus[HttpStatus["CONNECTION_TIMEOUT"] = 408] = "CONNECTION_TIMEOUT";
        HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
        HttpStatus[HttpStatus["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    })(HttpStatus = ApiService.HttpStatus || (ApiService.HttpStatus = {}));
})(ApiService = exports.ApiService || (exports.ApiService = {}));
//# sourceMappingURL=RhinoSpect.Api.js.map