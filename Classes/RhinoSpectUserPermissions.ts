import { Bitwise } from "./Bitwise";

export class RhinoSpectUserPermissions {

	public permissions: number;

	constructor( _permissions: number ){
		this.permissions = _permissions;
	}

	private permissionTest( permission: number, test: number ){
		const bwTest = new Bitwise( permission || 0 );
		return bwTest.test(test);
	}

	public addPermission( permission: RhinoSpectUserPermissions.Permissions ){
		const bw = new Bitwise(this.permissions);
		bw.set(permission);
		this.permissions = bw.toNumber();
	}

	public removePermission( permission: RhinoSpectUserPermissions.Permissions ){
		const bw = new Bitwise(this.permissions);
		bw.unset(permission);
		this.permissions = bw.toNumber();
	}

	public canRead() {

		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.Read );
	}

	public canEdit() {
		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.Write );
	}

	public canAlterSecurity() {
		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.Security );
	}

	public canEditModule() {
		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.ModuleEdit );
	}

	public canBeAssignedTo() {
		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.AssignTo );
	}

	public isRestrictedToAssignedTo() {
		return this.permissionTest( this.permissions, RhinoSpectUserPermissions.Permissions.RestrictedToAssignedTo );
	}
}

export namespace RhinoSpectUserPermissions{
	export enum Permissions {
		None = 0x0,
        Read = 0x1,
        Write = 0x2,
        ModuleEdit = 0x4,
		Security = 0x8,
		AssignTo = 0x10,
        RestrictedToAssignedTo = 0x20
	}
}