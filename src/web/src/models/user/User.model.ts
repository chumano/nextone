import { BaseObjectCRUD } from "./../ObjectCRUD.model";
import { UserRole } from "./UserRole.model";

export interface User extends BaseObjectCRUD {
	Id: string;
	Name: string;
	Email: string;
	Phone: string;
	Role: UserRole;
}
