import { useHistory, useLocation } from "react-router";
import { AuthenticationService } from "../../services";
import '../../styles/pages/intro/intro-page.scss';
import logo from '../../assets/logo.png';
import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { ReactComponent as IntroSVG } from '../../assets/intro_img.svg';
import { useCallback, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignInAlt
} from "@fortawesome/free-solid-svg-icons";
import { IAppStore } from "../../store";
import { useSelector } from "react-redux";
import NewsList from "./NewsList";
import { DEFAULT_PAGE } from "../../utils";

const IntroPage: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const user = useSelector((store: IAppStore) => store.auth.user);

   
    return <>
        <div className="intro-page">
           

            <div className="intro-page__body">
                <div className="intro-page__intro">
                    <div className="intro__text">
                        <h2>Hệ thống UCOM</h2>
                        Hệ thống chỉ huy, điều hành thống nhất
                    </div>
                    <div className="intro__img">
                        <IntroSVG width={'100%'} />
                    </div>
                </div>

                <div className="intro-page__container">
                   <NewsList/>
                </div>

            </div>
            
        </div>
    </>;
}

export default IntroPage;