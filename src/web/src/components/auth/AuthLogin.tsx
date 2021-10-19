import { useHistory, useLocation } from "react-router";
import { AuthenticationService } from "../../services";
import '../../styles/components/auth/login.scss';
import logo from '../../assets/logo.png';
import { useContext, useEffect } from "react";
import { AppContext } from "../../utils/contexts/AppContext";

const AuthLogin: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    

    useEffect(() => {
        AuthenticationService.isAuthenticated().then((authenticated)=>{
            if(authenticated) 
                history.push("/home");
        });
    }, [])
    const login = () => {
        let redirectUrl = "/home";
        AuthenticationService.signinRedirect(redirectUrl);
    }
    return <>
        <div className="login-page">

            <div className="login-page__intro">
                <h1>Hệ thống UCOM</h1>
                <div className="login-page__logo">
                    <img  src={logo} alt='' />
                </div>
            </div>
            <div className="login-page__container">
                <button className="button yes-btn button-primary" onClick={login}>
                    Đăng nhập
                </button>
            </div>

            <div className="login-page__bottom">
                Copyright © 2020-2021
            </div>
        </div>
    </>;
}

export default AuthLogin;