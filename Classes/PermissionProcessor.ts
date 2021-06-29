import { fileURLToPath } from "url";
import { Bitwise } from "./Bitwise";
import { IApiService } from "./RhinoSpect.Api";
import { RhinoSpectUserPermissions } from "./RhinoSpectUserPermissions";

export class PermissionProcessor {

	//private _apiSvc: IApiService;

	constructor(  ){
	}

	public calculatePermissions(permissionsNumber: number, changes: IPermissions): number {

		const permissions = new RhinoSpectUserPermissions(permissionsNumber);

		if( changes.read !== undefined ) this.setPermission( permissions, changes.read, RhinoSpectUserPermissions.Permissions.Read);
		if( changes.write !== undefined ) this.setPermission( permissions, changes.write, RhinoSpectUserPermissions.Permissions.Write);
		if( changes.moduleEdit !== undefined ) this.setPermission( permissions, changes.moduleEdit, RhinoSpectUserPermissions.Permissions.ModuleEdit);
		if( changes.sercurity !== undefined ) this.setPermission( permissions, changes.sercurity, RhinoSpectUserPermissions.Permissions.Security);
		if( changes.assignTo !== undefined ) this.setPermission( permissions, changes.assignTo, RhinoSpectUserPermissions.Permissions.AssignTo);
		if( changes.restrictToAssignedTo !== undefined ) this.setPermission( permissions, changes.restrictToAssignedTo, RhinoSpectUserPermissions.Permissions.RestrictedToAssignedTo);

		return permissions.permissions;
	}

	private setPermission(permissions: RhinoSpectUserPermissions, action: boolean, permission: RhinoSpectUserPermissions.Permissions): void {

		if( action === true ){
			permissions.addPermission(permission);
		}
		else {
			permissions.removePermission(permission);
		}

	}

}

export interface IPermissions {
	read?: boolean,
	write?: boolean,
	moduleEdit?: boolean,
	sercurity?: boolean,
	assignTo?: boolean,
	restrictToAssignedTo?: boolean
}