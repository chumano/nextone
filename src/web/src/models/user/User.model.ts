import { BaseObjectCRUD } from "./../ObjectCRUD.model";
import { UserRole } from "./UserRole.model";

export interface User extends BaseObjectCRUD {
	id: string;
	name: string;
	email: string;
	phone: string;
	roles: UserRole[] | null;
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

export interface UpdateUserRoleRequest {
	UserId: string;
	RoleCodes: string[];
}

export interface FoundInDistanceUser {
	user: {
		userId :string,
        userName :string,
        status : 0|1|2

        lastUpdateDate: string,
       	lastLat :number,
        lastLon : number
	},
	distanceInMeter : number
}