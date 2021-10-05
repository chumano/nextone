import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import logo from '../../logo.svg';
import '../../styles/components/layout/sidebar.scss';
import { faCoffee, faAddressBook } from '@fortawesome/free-solid-svg-icons'

const MenuList = [
    {
        id:0,
        title:'Menu 1',
        path: '/home',
        icon: <FontAwesomeIcon icon={faCoffee} />
    },
    {
        id:1,
        title:'Menu 2',
        path: '/channel',
        icon: <FontAwesomeIcon icon={faAddressBook} />
    }
]

interface IProp {
    show: boolean
}
const SideBar :React.FC<IProp> = ({show}):JSX.Element=>{

    return <>
        <div className={"sidebar " + (show?"open":"")}>
            <Link to={'/home'}>
                <img className="sidebar__logo" src={logo} alt='' />
            </Link>

            <div className="sidebar-menu">
                <ul className="sidebar-menu__ul">
                    {MenuList.map((item,key)=>(
                        <li key={item.id} className="sidebar-menu__item"> 
                            <Link to={item.path} >
                                <div className="li-icon">
                                    {item.icon}
                                </div>
                                {item.title}
                            </Link>
                        </li>  
                    ))}
                </ul>
            </div>
        </div>
    </>;
}

export default SideBar;