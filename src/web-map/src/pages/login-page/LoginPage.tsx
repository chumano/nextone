import { Button } from "antd";
import AuthenticationService from "../../services/AuthenticationService";
import '../../styles/pages/login-page.scss';
import map_bg from '../../assets/images/map_bg.jpg';
const LoginPage : React.FC = ()=>{
    const login = async () => {
        let redirectUrl = "/";
        AuthenticationService.signinRedirect(redirectUrl);
        //await AuthenticationService.signin('manager', 'Nextone@123');
    }
    
    return <>
        <div className="login-page" >
            <div className="login-page__container">
                <div className="login-page__login">
                    <h1>Map Service</h1>
                    <Button type="primary" onClick={login}>
                        Đăng nhập
                    </Button>
                </div>
                <div className="login-page__info">
                    <img src={map_bg} />
                </div>
            </div>
           
        </div>
    </>
}

export default LoginPage;