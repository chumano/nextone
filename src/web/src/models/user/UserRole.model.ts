import { Role } from "../role/Role.model";

export interface UserRole {
    userId: string;
    roleCode: string;
    role: Role
}