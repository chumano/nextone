export interface RolePermission {
	roleCode: string;
	permissionCode: string;
	permission: Permission;
}

export interface Permission {
	code: string;
	name: string;
}
