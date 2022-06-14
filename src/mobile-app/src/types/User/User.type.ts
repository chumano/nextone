import { UserRole } from "./UserRole.type";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[] | null;
}

