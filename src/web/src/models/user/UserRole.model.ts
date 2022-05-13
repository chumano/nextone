import { Role } from "../role/Role.model";

export interface UserRole {
    UserId: string;
    RoleCode: string;
    Role: Role
}