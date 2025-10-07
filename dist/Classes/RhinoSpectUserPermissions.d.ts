export declare class RhinoSpectUserPermissions {
    permissions: number;
    constructor(_permissions: number);
    private permissionTest;
    addPermission(permission: RhinoSpectUserPermissions.Permissions): void;
    removePermission(permission: RhinoSpectUserPermissions.Permissions): void;
    canRead(): boolean;
    canEdit(): boolean;
    canAlterSecurity(): boolean;
    canEditModule(): boolean;
    canBeAssignedTo(): boolean;
    isRestrictedToAssignedTo(): boolean;
}
export declare namespace RhinoSpectUserPermissions {
    enum Permissions {
        None = 0,
        Read = 1,
        Write = 2,
        ModuleEdit = 4,
        Security = 8,
        AssignTo = 16,
        RestrictedToAssignedTo = 32
    }
}
