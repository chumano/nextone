import { BaseObjectCRUD } from "./../ObjectCRUD.model";
import { UserRole } from "./UserRole.model";

export interface User extends BaseObjectCRUD {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
}
