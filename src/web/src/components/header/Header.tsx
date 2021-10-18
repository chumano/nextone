import '../../styles/components/header/header.scss'
import HeaderNotification from './HeaderNotification';
import UserProfileMenu from './UserProfileMenu';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBars
} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from '../../utils/contexts/AppContext';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AuthState, getIsLoggedIn } from '../../store';

interface IProp {
    toggleDrawer: ()=> void
}
const Header :React.FC<IProp> = ({toggleDrawer}):JSX.Element=>{
    const {user} = useContext(AppContext);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const [userName, setUserName] = useState('Guest')
    useEffect(() => {
        const name:string  = user?.profile?.name || user?.profile?.email || user?.profile?.sub || 'NoName';
        setUserName( name as string )
    }, [user])
    
    return <>
        <div className="header">
            <div className="header__drawer" onClick={toggleDrawer}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <div>
                Welcome: {userName}!
                
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