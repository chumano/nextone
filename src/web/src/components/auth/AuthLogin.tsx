import { useHistory, useLocation } from "react-router";
import { AuthenticationService } from "../../services";
import '../../styles/components/auth/login.scss';
import logo from '../../assets/logo.png';
import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { ReactComponent as IntroSVG } from '../../assets/intro_img.svg';
import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignInAlt
} from "@fortawesome/free-solid-svg-icons";

const AuthLogin: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    

    useEffect(() => {
        AuthenticationService.isAuthenticated().then((authenticated)=>{
            if(authenticated) {
                history.push("/home");
            }
        });
    }, [])
    const login = () => {
        let redirectUrl = "/home";
        AuthenticationService.signinRedirect(redirectUrl);
    }
    return <>
        <div className="login-page">
            <div className="login-page__header">
                <div className="header__logo">
                    <LogoSVG/>
                </div>
                <div className="header__appname">
                    UCOM
                </div>
                <div className="flex-spacer"></div>

                <div className="header__actions">
                    <button className="button button-primary button--icon-label"  onClick={login}>
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span className="button-label">Đăng nhập </span>
                    </button>
                </div>
            </div>

            <div className="login-page__body">
                <div className="login-page__intro">
                    <div className="intro__text">
                        <h2>Hệ thống UCOM</h2>
                        Kênh liên lạc và theo dõi sự cố
                    </div>
                    <div className="intro__img">
                        <IntroSVG width={'100%'} />
                    </div>
                </div>

                <div className="login-page__container">
                   Danh sách các tin tức
                </div>

                <div className="login-page__bottom">
                    Copyright © 2020-2021
                </div>
            </div>
            
        </div>
    </>;
}

export default AuthLogin;