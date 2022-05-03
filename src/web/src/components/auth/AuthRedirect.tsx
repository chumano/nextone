import { useEffect } from "react";
import { AuthenticationService } from "../../services";
import Loading from "../controls/loading/Loading";

const AuthRedirect : React.FC = ()=>{
    useEffect(()=>{
        AuthenticationService.signout();
    },[]);
    return <>
        <Loading></Loading>
    </>;
}

export default AuthRedirect;