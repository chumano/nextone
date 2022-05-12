import { UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";
import { IDENTITY_API } from "../../config/AppWindow";


let hostUrl  = window.location.origin;

export const OidcConfig: UserManagerSettings = {
    client_id: "web-map-spa",
    redirect_uri: `${hostUrl}/auth/callback`,
    authority: IDENTITY_API,
    response_type: "code",
    post_logout_redirect_uri: `${hostUrl}/auth/signout-callback`,// the page will be returned after logout from SSO
    scope : "openid profile offline_access gateway master-scope",
    silent_redirect_uri : `${hostUrl}/auth/silent-callback`,
    automaticSilentRenew : true,
    loadUserInfo: true,
    userStore : new WebStorageStateStore({ store: localStorage}),
    prompt : "login"
};