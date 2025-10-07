"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RhinoSpectUserPermissions = void 0;
const Bitwise_1 = require("./Bitwise");
class RhinoSpectUserPermissions {
    permissions;
    constructor(_permissions) {
        this.permissions = _permissions;
    }
    permissionTest(permission, test) {
        const bwTest = new Bitwise_1.Bitwise(permission || 0);
        return bwTest.test(test);
    }
    addPermission(permission) {
        const bw = new Bitwise_1.Bitwise(this.permissions);
        bw.set(permission);
        this.permissions = bw.toNumber();
    }
    removePermission(permission) {
        const bw = new Bitwise_1.Bitwise(this.permissions);
        bw.unset(permission);
        this.permissions = bw.toNumber();
    }
    canRead() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.Read);
    }
    canEdit() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.Write);
    }
    canAlterSecurity() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.Security);
    }
    canEditModule() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.ModuleEdit);
    }
    canBeAssignedTo() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.AssignTo);
    }
    isRestrictedToAssignedTo() {
        return this.permissionTest(this.permissions, RhinoSpectUserPermissions.Permissions.RestrictedToAssignedTo);
    }
}
exports.RhinoSpectUserPermissions = RhinoSpectUserPermissions;
(function (RhinoSpectUserPermissions) {
    let Permissions;
    (function (Permissions) {
        Permissions[Permissions["None"] = 0] = "None";
        Permissions[Permissions["Read"] = 1] = "Read";
        Permissions[Permissions["Write"] = 2] = "Write";
        Permissions[Permissions["ModuleEdit"] = 4] = "ModuleEdit";
        Permissions[Permissions["Security"] = 8] = "Security";
        Permissions[Permissions["AssignTo"] = 16] = "AssignTo";
        Permissions[Permissions["RestrictedToAssignedTo"] = 32] = "RestrictedToAssignedTo";
    })(Permissions = RhinoSpectUserPermissions.Permissions || (RhinoSpectUserPermissions.Permissions = {}));
})(RhinoSpectUserPermissions = exports.RhinoSpectUserPermissions || (exports.RhinoSpectUserPermissions = {}));
//# sourceMappingURL=RhinoSpectUserPermissions.js.map