import { Role } from "../Role/Role.type";

export interface UserRole {
  userId: string;
  roleCode: string;
  role: Role;
}
