import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../logo.svg';
import { MenuList } from "../../Route";
import '../../styles/components/layout/sidebar.scss';

interface IProp {
    show: boolean
}
const SideBar :React.FC<IProp> = ({show}):JSX.Element=>{
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);

    useEffect(() => {
        const path = window.location.pathname.toLowerCase();
        const index = MenuList.findIndex((menu)=>menu.path == path);
        setSelectedMenuIndex(index);
    }, []);

    return <>
        <div className={"sidebar " + (show?"open":"")}>
            <div className="sidebar__logo">
                <Link to={'/home'} >
                    <img  src={logo} alt='' />
                </Link>
            </div>
            

            <div className="sidebar-menu">
                <ul className="sidebar-menu__ul">
                    {MenuList.map((item,index)=>(
                        <li key={item.id} className={"sidebar-menu__item"+ (selectedMenuIndex==index?" active":"")}> 
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