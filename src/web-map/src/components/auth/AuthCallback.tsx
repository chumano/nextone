import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from '../../services/AuthenticationService'
import Loading from "../common/Loading";


const AuthCallback : React.FC<any> = (props) =>{
    const navigate = useNavigate();
    useEffect(() => {
        let signinCallback = async ()=>{
            const authenticated = await AuthenticationService.isAuthenticated();
            if(authenticated){
                navigate('/');
            }else{
                try{
                    const user = await AuthenticationService.signinRedirectCallback();
                    const url = (user.state as any).url;
                    navigate(url);
                }catch (error){
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