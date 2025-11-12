"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleProcessor = void 0;
const RhinoSpect_Api_1 = require("./RhinoSpect.Api");
const Module_1 = require("./Module");
class ModuleProcessor {
    module;
    apiSvc;
    config;
    modulePromise;
    constructor(config) {
        this.config = config;
        this.apiSvc = new RhinoSpect_Api_1.ApiService(config.url, config.token);
    }
    getModule() {
        return this.modulePromise ?? (this.modulePromise = this.apiSvc.getModule(this.config.moduleId)
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
            let modClass = module.definition?.find(v => v.id == classMap.classId);
            if (template) {
                if (modClass == undefined) {
                    modClass = template;
                    module.definition?.push(template);
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
            modClass.id = classMap.classId;
            modClass.name = classMap.className;
            if (sourceParts) {
                modClass.source.css = sourceParts.css;
                modClass.source.html = sourceParts.html;
                modClass.source.javascript = sourceParts.javascript;
            }
            return;
        });
    }
    patchClass(classMap, template) {
        return this.updateClass(classMap, undefined, template);
    }
    patchModule(template) {
        return this.getModule()
            .then(module => {
            Object.assign(module, template);
            return;
        });
    }
    updateMapFeatures(mapFeatures) {
        if (!mapFeatures) {
            throw Error("No map features were provided");
        }
        return this.getModule()
            .then(module => {
            module.mapFeatures = mapFeatures;
            const length = JSON.stringify(mapFeatures).length;
            const lengthStr = length > 1000 ? `${(length / 1000).toFixed(1)} kB` : `${length} B`;
            const names = mapFeatures.map(v => v.name).join(", ");
            return `Added ${mapFeatures.length} map features (${lengthStr}): ${names}`;
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