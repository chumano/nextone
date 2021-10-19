import React, { useContext, useEffect, useState } from "react";
import { Suspense } from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router";
import { AuthenticationService } from "../../services";
import { AppContext } from "../../utils/contexts/AppContext";
import Loading from "../controls/loading/Loading";
import Backdrop from "./Backdrop";
import '../../styles/components/layout/auth-layout.scss';

const Header = React.lazy(()=> import('../header/Header'));
const SideBar = React.lazy(()=> import('./SideBar'));

interface IProp extends RouteComponentProps{
    title: string
} 
const AuthLayout :React.FC<IProp> = ({children, location}):JSX.Element=>{
    const history = useHistory();
    const params = useParams();
    const [authenticated, setAuthenticated] = useState(false)
    const [sideDrawer, setSideDrawer] = useState(false);
    const {user, userLogIn, userLogOut} = useContext(AppContext);

    useEffect(() => {
        if(!user){
            let redirectUrl = location.pathname + (location.search || "");
            AuthenticationService.signinRedirect(redirectUrl);
        }else{
            setAuthenticated(true);
        }
    }, [user,location])

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
                        </div>   
                    </div>
                </Suspense>
            </div>
        }
        
    </>);
}

export default AuthLayout;