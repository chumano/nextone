import { UserManagerSettings, WebStorageStateStore } from "oidc-client";

let hostUrl  = window.location.origin;

export const OidcConfig: UserManagerSettings = {
    client_id: "web-spa",
    redirect_uri: `${hostUrl}/auth/callback`,
    response_type: "code",
    post_logout_redirect_uri: `${hostUrl}`,
    scope : "openid profile gateway master-scope",
    silent_redirect_uri : `${hostUrl}/auth/silent-callback`,
    automaticSilentRenew : true,
    loadUserInfo: false,
    userStore : new WebStorageStateStore({ store: localStorage}),
    prompt : "login"
};