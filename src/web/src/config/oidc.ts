import { UserManagerSettings, WebStorageStateStore } from "oidc-client";

export const OidcConfig: UserManagerSettings = {
    client_id: "NEXTONE-SPA",
    redirect_uri: "/auth/callback",
    authority: "/authority",
    response_type: "code",
    post_logout_redirect_uri: "/",
    scope: "openid profile mail map-service ucom-service",
    silent_redirect_uri: "/auth/silent_callback",
    automaticSilentRenew:true,
    loadUserInfo:true,
    userStore: new WebStorageStateStore({store: localStorage}),
    prompt: "login"
}