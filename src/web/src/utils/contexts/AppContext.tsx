import { User } from "oidc-client";
import { createContext, Dispatch, Reducer, ReducerAction, useCallback, useEffect, useMemo, useReducer } from "react";
import { useDispatch } from "react-redux";
import { AuthenticationService } from "../../services";
import { login, logout } from "../../store";

export const GlobalContext = createContext<any>({});

export const AppActions = {
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT'
}

interface AppState {
    user: User | undefined,
    userLogIn: (user: User) => void,
    userLogOut: () => void
}

const initialAppState: AppState = {
    user: undefined,
    userLogIn: (user: User) => {},
    userLogOut: () => {}
};

const AppContext = createContext<AppState>(initialAppState);

interface IContextProviderProp {
    children: React.ReactNode;
}

type AppAction = 
    |  { type: typeof AppActions.USER_LOGIN, payload: any } | { type: typeof AppActions.USER_LOGOUT, payload?:undefined };

const appStateReducer = (state: AppState, action: AppAction) => {
    switch (action.type) {
        case AppActions.USER_LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case AppActions.USER_LOGOUT:
            return {
                ...state,
                user: undefined
            };
        default:
            return state;
    }
}

const AppContextProvider = (props: IContextProviderProp) => {
    const storeDispatch = useDispatch();
    const [state, dispatch] = useReducer<Reducer<AppState, AppAction>>(appStateReducer, initialAppState)

    const handleUserOnLoaded = ()=> (user: User)=>{
        logIn(user);
    }

    const handleTokenExpired = () => async ()=>{
        dispatch({ type: AppActions.USER_LOGOUT});
        storeDispatch(logout());

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
    //===================================
    const logIn = useCallback(
        (user: any) => {
            dispatch({ type: AppActions.USER_LOGIN, payload: user });
            storeDispatch(login());
        }, []);

    const logOut = useCallback(
        () => {
            dispatch({ type: AppActions.USER_LOGOUT});
            storeDispatch(logout());
            AuthenticationService.signout();
        }, []);
    
    const value = useMemo(() => ({
        ...state,
        userLogIn: logIn,
        userLogOut: logOut
    }), [state,logIn,logOut]);

    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}

export { AppContext, AppContextProvider }