import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';
import { MenuList } from "../../Route";
import { IAppStore } from "../../store";
import '../../styles/components/layout/sidebar.scss';
import { DEFAULT_PAGE } from "../../utils";

interface IProp {
    show: boolean
}
const SideBar :React.FC<IProp> = ({show}):JSX.Element=>{
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [menuHasNotification, setMenuHasNotification] = useState<{[key:string]: boolean}>({ 20 : true })

    const user = useSelector((store: IAppStore) => store.auth.user);
    const systemUserRole = user?.profile.role as string;

    const showMenus = useMemo(()=>{
        return MenuList.filter(o=> o.roles ===undefined || o.roles.length==0 ||  o.roles.indexOf(systemUserRole)!==-1 )
    }, [systemUserRole]);

    useEffect(() => {
        const path = window.location.pathname.toLowerCase();
        const index = MenuList.findIndex((menu)=>menu.path == path);
        setSelectedMenuIndex(index);
    }, []);

    return <>
        <div className={"sidebar " + (show?"open":"")}>
            <div className="sidebar__logo">
                <Link to={'/'} >
                    <img  src={logo} alt='' />
                </Link>
            </div>
            

            <div className="sidebar-menu">
                <ul className="sidebar-menu__ul">
                    {showMenus.map((item,index)=>(
                        <li key={item.id} className={"sidebar-menu__item"+ (selectedMenuIndex==index?" active":"")}> 
                            <Link to={item.path} >
                                <div className="li-icon" title={item.title}>
                                    {item.icon}
                                </div>

                                { menuHasNotification[item.id] && 
                                    <span className="item__notification"></span>
                                }
                            </Link>
                           
                        </li>  
                    ))}
                </ul>
            </div>
        </div>
    </>;
}

export default SideBar;