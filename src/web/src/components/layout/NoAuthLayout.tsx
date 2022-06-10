import { Suspense, useCallback, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import Loading from "../controls/loading/Loading";
import '../../styles/components/layout/noauth-layout.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationService } from "../../services";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAppStore } from "../../store";
import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { DEFAULT_PAGE } from "../../utils";

const loading = () => <Loading />;

interface IProp extends RouteComponentProps {
}

const NoAuthLayout: React.FC<IProp> = (props): JSX.Element => {
    const history = useHistory();
    const location = useLocation();
    const user = useSelector((store: IAppStore) => store.auth.user);

    const login = useCallback(() => {
        if (user) {
            history.push(DEFAULT_PAGE);
            return;
        }

        let redirectUrl = DEFAULT_PAGE
        AuthenticationService.signinRedirect(redirectUrl);
    }, [user])

    return <>
        <div className="noauth-layout">
            <div className="noauth-layout__header">
                <div className="header__logo">
                    <a href="/intro"><LogoSVG /></a>
                </div>
                <div className="header__appname">
                    UCOM
                </div>
                <div className="flex-spacer"></div>

                <div className="header__actions">
                    <button className="button button-primary button--icon-label" onClick={login}>
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span className="button-label">Đăng nhập </span>
                    </button>
                </div>
            </div>
            <div className="noauth-layout__body">
                <Suspense fallback={loading()}>
                    {props.children}
                </Suspense>
            </div>
            <div className="noauth-layout__bottom">
                Copyright © 2022
            </div>
        </div>
    </>;
}

export default NoAuthLayout;