import { RolePermission } from "./RolePermission.type";

export interface Role {
  code: string;
  name: string;
  permissions: RolePermission[];
}
