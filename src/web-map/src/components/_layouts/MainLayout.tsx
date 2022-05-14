import MainHeader from "./MainHeader";
import '../../styles/_layout/main-layout.scss';
import { useDispatch, useSelector } from "react-redux";
import { IAppStore } from "../../stores/appStore";
import { useCallback, useEffect } from "react";
import AuthenticationService from "../../services/AuthenticationService";
import Loading from "../common/Loading";
import { useLocation } from "react-router-dom";
import { authActions } from "../../stores/auth/authReducer";
import { User } from "oidc-client-ts";
import AuthNoPermission from "../auth/AuthNoPermission";
const MainLayout : React.FC<any> = ({children})=>{
    const dispatch = useDispatch();
    const location = useLocation();
    const isLoggedIn = useSelector((state: IAppStore) => state.auth.isLoggedIn);
    const user = useSelector((state: IAppStore) => state.auth.user);
    useEffect(() => {
        if(!isLoggedIn){
            let redirectUrl = location.pathname + (location.search || "");
            AuthenticationService.signinRedirect(redirectUrl);
        }
    }, [isLoggedIn,location])
    
    const logIn = useCallback(
        (user: User) => {
            console.log("user", user);
            dispatch(authActions.login(user));
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
        {!isLoggedIn && <Loading/>}

        {isLoggedIn && 
            <div className="main-layout-container">
                <div className="header-container">
                    <MainHeader/>
                </div>
                <div>
                    {user?.profile['role'] ==='admin' &&
                        children 
                    }
                     {user?.profile['role'] !=='admin' &&
                        <AuthNoPermission/> 
                    }
                </div>
            </div>
        }
    </>
}

export default MainLayout;