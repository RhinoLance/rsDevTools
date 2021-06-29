"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionProcessor = void 0;
const RhinoSpectUserPermissions_1 = require("./RhinoSpectUserPermissions");
class PermissionProcessor {
    //private _apiSvc: IApiService;
    constructor() {
    }
    calculatePermissions(permissionsNumber, changes) {
        const permissions = new RhinoSpectUserPermissions_1.RhinoSpectUserPermissions(permissionsNumber);
        if (changes.read !== undefined)
            this.setPermission(permissions, changes.read, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Read);
        if (changes.write !== undefined)
            this.setPermission(permissions, changes.write, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Write);
        if (changes.moduleEdit !== undefined)
            this.setPermission(permissions, changes.moduleEdit, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.ModuleEdit);
        if (changes.sercurity !== undefined)
            this.setPermission(permissions, changes.sercurity, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Security);
        if (changes.assignTo !== undefined)
            this.setPermission(permissions, changes.assignTo, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.AssignTo);
        if (changes.restrictToAssignedTo !== undefined)
            this.setPermission(permissions, changes.restrictToAssignedTo, RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.RestrictedToAssignedTo);
        return permissions.permissions;
    }
    setPermission(permissions, action, permission) {
        if (action === true) {
            permissions.addPermission(permission);
        }
        else {
            permissions.removePermission(permission);
        }
    }
}
exports.PermissionProcessor = PermissionProcessor;
//# sourceMappingURL=PermissionProcessor.js.map