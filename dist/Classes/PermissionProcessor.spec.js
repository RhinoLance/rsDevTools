"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PermissionProcessor_1 = require("./PermissionProcessor");
const RhinoSpectUserPermissions_1 = require("./RhinoSpectUserPermissions");
describe("PermissionProcessor", () => {
    const _config = {
        name: "test",
        url: "none",
        token: "000",
        moduleId: "000",
        classMap: [{
                className: "test",
                classId: "test",
                componentName: "TestComponent",
                sourceFolder: "./",
                templateFilePath: "./dummy"
            }]
    };
    it("calculatePermissions_withReadAdd_shouldAddReadPermissions", () => {
        const mp = new PermissionProcessor_1.PermissionProcessor();
        const permissionsNumber = 0;
        const changes = {
            read: true
        };
        const result = mp.calculatePermissions(permissionsNumber, changes);
        expect(result).toBe(RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Read);
    });
    it("calculatePermissions_withWriteAdd_shouldAddWritedPermissions", () => {
        const mp = new PermissionProcessor_1.PermissionProcessor();
        const permissionsNumber = 0;
        const changes = {
            write: true
        };
        const result = mp.calculatePermissions(permissionsNumber, changes);
        expect(result).toBe(RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Write);
    });
    it("calculatePermissions_withSecurityAdd_shouldAddSecurityPermissions", () => {
        const mp = new PermissionProcessor_1.PermissionProcessor();
        const permissionsNumber = 0;
        const changes = {
            security: true
        };
        const result = mp.calculatePermissions(permissionsNumber, changes);
        expect(result).toBe(RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Write);
    });
    it("calculatePermissions_withReadRemove_shouldRemoveReadPermissions", () => {
        const mp = new PermissionProcessor_1.PermissionProcessor();
        const permissionsNumber = RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Read;
        const changes = {
            read: false
        };
        const result = mp.calculatePermissions(permissionsNumber, changes);
        expect(result).toBe(RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.None);
    });
    it("calculatePermissions_withWriteRemove_shouldRemoveWritedPermissions", () => {
        const mp = new PermissionProcessor_1.PermissionProcessor();
        const permissionsNumber = RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.Write;
        const changes = {
            write: false
        };
        const result = mp.calculatePermissions(permissionsNumber, changes);
        expect(result).toBe(RhinoSpectUserPermissions_1.RhinoSpectUserPermissions.Permissions.None);
    });
});
//# sourceMappingURL=PermissionProcessor.spec.js.map