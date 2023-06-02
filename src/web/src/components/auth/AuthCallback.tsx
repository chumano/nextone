import React, { useEffect } from "react";
import { RouteChildrenProps } from "react-router";
import { AuthenticationService } from "../../services";
import Loading from "../controls/loading/Loading";

interface IProp extends  React.Component , RouteChildrenProps{

} 
const AuthCallback : React.FC<IProp> = (props) =>{
    useEffect(() => {
        let signinCallback = async ()=>{
            try{
                const user = await AuthenticationService.signinRedirectCallback();
                props.history.replace(user.state.url);
            }catch (error){
                if(await AuthenticationService.isAuthenticated()){
                    props.history.replace('/')
                }else{
                    console.error(error);
                }
            }
        }

        signinCallback();
    }, [])

    return <>
        <h1>Đang xác thực...</h1>
        <Loading></Loading>
    </>;
}

export default AuthCallback;