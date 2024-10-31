"use strict";
//export namespace RhinoSpect {
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.FormType = exports.Module = void 0;
class Module {
    constructor(record) {
        if (record) {
            this.fromDto(record);
        }
    }
    fromDto(record) {
        var _a, _b;
        Object.assign(this, record);
        this.modified = new Date(record.modified);
        this.created = new Date(record.created);
        try {
            this.definition = JSON.parse((_a = record.definition) !== null && _a !== void 0 ? _a : []);
        }
        catch (ex) {
            throw ("Module definition is invalid.  Inner exception: " + ex.message);
        }
        try {
            this.mapFeatures = JSON.parse((_b = record.mapFeatures) !== null && _b !== void 0 ? _b : []);
        }
        catch (ex) {
            throw ("Module definition is invalid.  Inner exception: " + ex.message);
        }
    }
    toDto() {
        var _a, _b, _c, _d, _e, _f;
        const record = Object.assign({}, this);
        record.modified = (_b = (_a = this.modified) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : new Date().toISOString();
        record.created = (_d = (_c = this.created) === null || _c === void 0 ? void 0 : _c.toISOString()) !== null && _d !== void 0 ? _d : new Date().toISOString();
        record.definition = JSON.stringify((_e = this.definition) !== null && _e !== void 0 ? _e : []);
        record.mapFeatures = JSON.stringify((_f = this.mapFeatures) !== null && _f !== void 0 ? _f : []);
        return record;
    }
}
exports.Module = Module;
var FormType;
(function (FormType) {
    FormType[FormType["wizard"] = 0] = "wizard";
    FormType[FormType["source"] = 1] = "source";
})(FormType = exports.FormType || (exports.FormType = {}));
var Permissions;
(function (Permissions) {
    Permissions[Permissions["None"] = 0] = "None";
    Permissions[Permissions["Read"] = 1] = "Read";
    Permissions[Permissions["Write"] = 2] = "Write";
    Permissions[Permissions["ModuleEdit"] = 4] = "ModuleEdit";
    Permissions[Permissions["Security"] = 8] = "Security";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
//}
//# sourceMappingURL=Module.js.map