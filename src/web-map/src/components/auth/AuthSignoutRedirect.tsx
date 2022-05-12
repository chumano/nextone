import { useEffect } from "react";
import AuthenticationService  from "../../services/AuthenticationService";
import Loading from "../common/Loading";

const AuthSignoutRedirect : React.FC = ()=>{
    useEffect(()=>{
        AuthenticationService.signout();
    },[]);
    return <>
        <Loading></Loading>
    </>;
}

export default AuthSignoutRedirect;