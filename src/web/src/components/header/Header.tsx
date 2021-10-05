import '../../styles/components/header/header.scss'
import HeaderNotification from './HeaderNotification';
import UserProfileMenu from './UserProfileMenu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBars
} from "@fortawesome/free-solid-svg-icons";

interface IProp {
    toggleDrawer: ()=> void
}
const Header :React.FC<IProp> = ({toggleDrawer}):JSX.Element=>{

    return <>
        <div className="header">
            <div className="header__drawer" onClick={toggleDrawer}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            <div className="header__space"></div>

            <div className="header__notification">
                <HeaderNotification />
            </div>


            <div className="header__profile">
                <UserProfileMenu />
            </div>
        </div>
    </>;
}

export default Header;