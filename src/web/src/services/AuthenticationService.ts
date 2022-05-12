import axios from "axios";
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

    public async signin(username:string, password: string){
        const token_endpoint = await this.userManager.metadataService.getTokenEndpoint();
        const params = {
            client_id: OidcConfig.client_id,
            grant_type:'password',
            username: username,
            password: password,
            scope: OidcConfig.scope,
          };
        let body: string = this.encodeParams(params);
        await axios.post(token_endpoint!, body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });
    }

    //send request to signin
    public async signinRedirect(url: string){
        const authenticated = await this.isAuthenticated();
        if(!authenticated){
            await this.userManager.signinRedirect({state: {url}});
        }
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

    
    private encodeParams(params: any): string {
        let body: string = '';
        for (let key in params) {
          if (body.length) {
            body += '&';
          }
          body += key + '=';
          body += encodeURIComponent(params[key]);
        }
    
        return body;
      }
}

export default new AuthenticationService();