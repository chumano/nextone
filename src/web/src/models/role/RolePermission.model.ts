export interface RolePermission {
	RoleCode: string;
	PermissionCode: string;
	Permission: Permission;
}

export interface Permission {
	Code: string;
	Name: string;
}
