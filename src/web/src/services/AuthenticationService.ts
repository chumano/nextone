import { User, UserManager } from "oidc-client";
import { OidcConfig } from "../components/auth/OidcConfig";

class AuthenticationService {
    private userManager : UserManager;
    constructor(){
        this.userManager = new UserManager(OidcConfig);
    }

    public getUser() : Promise<User|null>{
        return this.userManager?.getUser();
    }

    public async getAuthenticatedUser() : Promise<User|null>{
        const user = await this.getUser();
        if(user && !user.expired) return user;

        return null;
    }

    public async getAccessToken() : Promise<string>{
        const user = await this.getUser();
        if(!user) return "";
        return user.access_token;
    }

    public async isAuthenticated() {
        const user = await this.getUser();
        if(!user) return false;

        return !user.expired;
    }

    //send request to signin
    public async signinRedirect(url: string){
        const authenticated = await this.isAuthenticated();
        //if(!authenticated){
            await this.userManager.signinRedirect({data: {url}});
        //}
    }

    //receive signin response
    public async signinRedirectCallback(url?:string){
        return await this.userManager.signinRedirectCallback(url);
    }

    //send reuqest to signin silent
    public signinSilent() {
        return this.userManager.signinSilent();
    }

    //request signout
    public async signout(){
        const user = await this.getUser();
        if(user){
            localStorage.clear();
            await this.userManager.signoutRedirect({id_token_hint: user.id_token });
        }
    }

    //events
    public get Events() {
        return this.userManager.events;
    }  
}

export default new AuthenticationService();