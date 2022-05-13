import { RolePermission } from "./RolePermission.model";

export interface Role {
	Code: string;
	Name: string;
	Permissions: RolePermission[];
}
