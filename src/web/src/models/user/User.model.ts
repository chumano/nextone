import { BaseObjectCRUD } from "./../ObjectCRUD.model";
import { UserRole } from "./UserRole.model";

export interface User extends BaseObjectCRUD {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole | null;
}

export interface CreateUserRequest {
	Name: string;
	Email: string;
	Phone: string;
}

export interface CreateUserResponse extends User {}

export interface UpdateUserRequest {
	UserId: string;
	Name: string;
	Email: string;
	Phone: string;
	RoleCodes: string[];
}

export interface ActivateUserRequest {
	UserId: string;
	IsActive: boolean;
}

export interface ResetPasswordUserRequest {
	UserId: string;
}