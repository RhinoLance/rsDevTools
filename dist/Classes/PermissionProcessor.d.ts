export declare class PermissionProcessor {
    constructor();
    calculatePermissions(permissionsNumber: number, changes: IPermissions): number;
    private setPermission;
}
export interface IPermissions {
    read?: boolean;
    write?: boolean;
    moduleEdit?: boolean;
    security?: boolean;
    assignTo?: boolean;
    restrictToAssignedTo?: boolean;
}
