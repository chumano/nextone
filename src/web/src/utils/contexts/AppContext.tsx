import { createContext, Dispatch, Reducer, ReducerAction, useCallback, useMemo, useReducer } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../../store";

export const GlobalContext = createContext<any>({});
export const UserContext =  createContext<any>({});

export const AppActions = {
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT'
}

interface AppState {
    user: any,
    userLogIn: (user: any) => void,
    userLogOut: () => void
}

const initialAppState: AppState = {
    user: { name: "chumano" },
    userLogIn: (user: any) => {},
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
    const rDispatch = useDispatch();
    const [state, dispatch] = useReducer<Reducer<AppState, AppAction>>(appStateReducer, initialAppState)

    const logIn = useCallback(
        (user: any) => {
            dispatch({ type: AppActions.USER_LOGIN, payload: user });
            rDispatch(login());
        }, []);

    const logOut = useCallback(
        () => {
            dispatch({ type: AppActions.USER_LOGOUT});
            rDispatch(logout());
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