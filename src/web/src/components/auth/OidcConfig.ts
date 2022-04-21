import { UserManagerSettings, WebStorageStateStore } from "oidc-client";
import API from "../../config/apis";

let hostUrl  = window.location.origin;

export const OidcConfig: UserManagerSettings = {
    client_id: "web-spa",
    redirect_uri: `${hostUrl}/auth/callback`,
    authority: API.ID_SERVICE,
    response_type: "code",
    post_logout_redirect_uri: `${hostUrl}/auth/signout-callback`,// the page will be returned after logout from SSO
    scope : "openid profile gateway master-scope",
    silent_redirect_uri : `${hostUrl}/auth/silent-callback`,
    automaticSilentRenew : true,
    loadUserInfo: false,
    userStore : new WebStorageStateStore({ store: localStorage}),
    prompt : "login"
};