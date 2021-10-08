import '../../styles/components/header/header.scss'
import HeaderNotification from './HeaderNotification';
import UserProfileMenu from './UserProfileMenu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBars
} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from '../../utils/contexts/AppContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthState, getIsLoggedIn } from '../../store';

interface IProp {
    toggleDrawer: ()=> void
}
const Header :React.FC<IProp> = ({toggleDrawer}):JSX.Element=>{
    const appContext = useContext(AppContext);
    const isLoggedIn = useSelector(getIsLoggedIn);
    
    return <>
        <div className="header">
            <div className="header__drawer" onClick={toggleDrawer}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div>
                Welcome: {appContext.user?.name || 'Guest'}!
                
            </div>

            <div className="header__space" style={{textAlign:'center'}}>{process.env.NODE_ENV}</div>

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