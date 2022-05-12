import { useEffect } from "react";
import Loading from "../controls/loading/Loading";

const AuthSilentCallback : React.FC = () =>{
    useEffect(() => {
        console.log('AuthSilentCallback...')
    }, [])

    return <>
        <Loading></Loading>
    </>;
}

export default AuthSilentCallback;