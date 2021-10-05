import React, { useState } from "react";
import { Suspense } from "react";
import { RouteComponentProps, useHistory, useParams } from "react-router";
import Loading from "../controls/loading/Loading";

const Header = React.lazy(()=> import('../header/Header'));
const SideBar = React.lazy(()=> import('./SideBar'));

interface IProp extends RouteComponentProps{
    title: string
} 
const AuthLayout :React.FC<IProp> = ({children, location}):JSX.Element=>{
    const authenticated = true;
    const history = useHistory();
    const params = useParams();
    const [sideDrawer, setSideDrawer] = useState(false);
    
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