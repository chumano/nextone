import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from '../../services/AuthenticationService'
import Loading from "../common/Loading";


const AuthSignoutCallback : React.FC<any> = (props) =>{
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [])

    return <>
        <Loading></Loading>
    </>;
}

export default AuthSignoutCallback;