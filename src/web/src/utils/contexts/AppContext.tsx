import { constant } from "lodash";
import { User } from "oidc-client";
import { createContext,  useCallback, useEffect} from "react";
import { useDispatch } from "react-redux";
import { AuthenticationService } from "../../services";
import { SignalR } from "../../services/SignalRService";
import { IAppStore, authActions } from "../../store";

export const GlobalContext = createContext<any>({});

interface IContextProviderProp {
    children: React.ReactNode;
}

SignalR.connect('/hubChat');

const registerHub = async ()=>{
    const accessToken = await AuthenticationService.getAccessToken()
    if(!accessToken)  return;
    const hubRegisterResult =await SignalR.invoke('register',accessToken);
    console.log('hubRegisterResult', hubRegisterResult)
}
const singalRSubsription =SignalR.subscription('connected',()=>{
    registerHub();
});
singalRSubsription.subscribe();

const AppContextProvider = (props: IContextProviderProp) => {
    const dispatch = useDispatch();
    
   const logIn = useCallback(
        (user: User) => {
            dispatch(authActions.login(user));
            registerHub();
    }, [dispatch]);

    const handleUserOnLoaded = ()=> (user: User)=>{
        logIn(user);
    }

    const handleTokenExpired = () => async ()=>{
        dispatch(authActions.logout());
        await AuthenticationService.signinSilent();
    }

    const addOidcEvents = useCallback(()=>{
        AuthenticationService.Events.addUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.addAccessTokenExpired(handleTokenExpired());
    },[])

    const removeOidcEvents = useCallback(()=>{
        AuthenticationService.Events.removeUserLoaded(handleUserOnLoaded());
        AuthenticationService.Events.removeAccessTokenExpired(handleTokenExpired());
    },[])

    useEffect(() => {
        addOidcEvents();
        AuthenticationService.getAuthenticatedUser().then( (user)=>{
            if(user){
                logIn(user);
            }
        });
        return () => {
            removeOidcEvents();
        }
    }, [addOidcEvents, removeOidcEvents])

    return <>
         {props.children}
    </>
}

export { AppContextProvider }