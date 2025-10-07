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
        Object.assign(this, record);
        this.modified = new Date(record.modified);
        this.created = new Date(record.created);
        try {
            this.definition = JSON.parse(record.definition ?? []);
        }
        catch (ex) {
            throw ("Module definition is invalid.  Inner exception: " + ex.message);
        }
        try {
            this.mapFeatures = JSON.parse(record.mapFeatures ?? []);
        }
        catch (ex) {
            throw ("Module definition is invalid.  Inner exception: " + ex.message);
        }
    }
    toDto() {
        const record = Object.assign({}, this);
        record.modified = this.modified?.toISOString() ?? new Date().toISOString();
        record.created = this.created?.toISOString() ?? new Date().toISOString();
        record.definition = JSON.stringify(this.definition ?? []);
        record.mapFeatures = JSON.stringify(this.mapFeatures ?? []);
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