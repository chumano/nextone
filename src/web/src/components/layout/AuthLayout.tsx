import React, { useContext, useEffect, useMemo, useState } from "react";
import { Suspense } from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router";
import { AuthenticationService } from "../../services";
import Loading from "../controls/loading/Loading";
import Backdrop from "./Backdrop";
import '../../styles/components/layout/auth-layout.scss';
import { CallStatus, getCallState, IAppStore } from "../../store";
import { useSelector } from "react-redux";
import CallSession from "../call/call-session";

const Header = React.lazy(()=> import('../header/Header'));
const SideBar = React.lazy(()=> import('./SideBar'));

interface IProp extends RouteComponentProps{
    title: string
} 
const AuthLayout :React.FC<IProp> = ({children, location}):JSX.Element=>{
    const history = useHistory();
    const params = useParams();
    const [authenticated, setAuthenticated] = useState(false);
    const [sideDrawer, setSideDrawer] = useState(false);
    const isLoggedIn = useSelector((state: IAppStore) => state.auth.isLoggedIn);
    const {status : callStatus} = useSelector(getCallState)

    useEffect(() => {
        if(!isLoggedIn){
            let redirectUrl = location.pathname + (location.search || "");
            AuthenticationService.signinRedirect(redirectUrl);
        }else{
            setAuthenticated(true);
        }
        
    }, [isLoggedIn,location])

    const toggleDrawer = ()=>{
        setSideDrawer(!sideDrawer);
    }

    const hideDrawer = ()=>{
        setSideDrawer(false);
    }
    return (<>
        {!authenticated && <Loading/>}
        {authenticated &&
            <div className="layout">
                <Suspense fallback={<Loading/>}>
                    {sideDrawer?<Backdrop backdropClick={hideDrawer}/>:(<></>)}
                    
                    <SideBar show={sideDrawer}/>

                    <div className="layout__container">
                        <Header toggleDrawer={toggleDrawer} />
                        <div className="layout__main">
                            {children}

                            {callStatus == CallStatus.calling
                            && <CallSession/>}
                        </div>   
                    </div>
                </Suspense>
            </div>
        }
        
    </>);
}

export default AuthLayout;