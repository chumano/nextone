import { User } from "oidc-client-ts";

export interface AuthState {
    isLoggedIn: boolean;
    user: User | undefined;
}
