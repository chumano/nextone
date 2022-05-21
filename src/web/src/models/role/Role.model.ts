import { RolePermission } from "./RolePermission.model";

export interface Role {
	code: string;
	name: string;
	permissions: RolePermission[];
}
