"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleProcessor = void 0;
const RhinoSpect_Api_1 = require("./RhinoSpect.Api");
const Module_1 = require("./Module");
class ModuleProcessor {
    constructor(config) {
        this.config = config;
        this.apiSvc = new RhinoSpect_Api_1.ApiService(config.url, config.token);
    }
    getModule() {
        var _a;
        return (_a = this.modulePromise) !== null && _a !== void 0 ? _a : (this.modulePromise = this.apiSvc.getModule(this.config.moduleId)
            .then(dto => {
            this.module = new Module_1.Module(dto);
            return this.module;
        })
            .catch(err => {
            throw (`RhinoSpect module could not be retrieved for ${this.config.moduleId}.\nError: ${err}`);
        }));
    }
    updateClass(classMap, sourceParts, template) {
        return this.getModule()
            .then(module => {
            var _a, _b;
            let modClass = (_a = module.definition) === null || _a === void 0 ? void 0 : _a.find(v => v.id == classMap.classId);
            if (template) {
                if (modClass == undefined) {
                    (_b = module.definition) === null || _b === void 0 ? void 0 : _b.push(template);
                    modClass = template;
                }
                else {
                    Object.assign(modClass, template);
                }
            }
            else {
                if (modClass == undefined) {
                    throw (`A class definition could not be found as either a template or the server's module for "${classMap.className}"`);
                }
            }
            Object.assign(modClass, template);
            modClass.source.css = sourceParts.css;
            modClass.source.html = sourceParts.html;
            modClass.source.javascript = sourceParts.javascript;
            return;
        });
    }
    pushModuleToServer() {
        if (!this.module) {
            throw ("No module has been retrieved to push");
        }
        return this.apiSvc.saveModule(this.module.toDto());
    }
}
exports.ModuleProcessor = ModuleProcessor;
//# sourceMappingURL=ModuleProcessor.js.map