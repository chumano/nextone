import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faUser, 
    faSignOutAlt,
    faCog } 
    from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import '../../styles/components/header/user-profile-menu.scss'


const ProfileMenus:any[] = [
    {
        label: "Thông tin",
        path: "/",
        icon: <FontAwesomeIcon icon={faUser} />
    },
    {
        label: "Cấu hình",
        path: "/",
        icon: <FontAwesomeIcon icon={faCog} />
    },
    {
        label: "Đăng xuất",
        click: ()=>{ console.log("logout")},
        icon: <FontAwesomeIcon icon={faSignOutAlt} />
    }
];

const UserProfileMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Dropdown
            isOpen={isOpen}
            toggle={() => { setIsOpen(!isOpen); }}
            className="profile"
        >
            <DropdownToggle
                onClick={() => { setIsOpen(!isOpen); }}
                className="profile__toggle"
            >
                <div className="profile__icon">
                    <FontAwesomeIcon className="profile__icon-fa" icon={faUser} />
                </div>
            </DropdownToggle>

            <DropdownMenu right={true} className="dropdown" >
                <div onClick={() => { setIsOpen(!isOpen); }}>
                    {ProfileMenus.map((menu, index) => {
                        return (
                            <React.Fragment key={index}>
                                {menu.path ? (
                                    <Link to={menu.path} className="dropdown-item dropdown__item">
                                        <div className="dropdown__icon">
                                            {menu.icon}
                                        </div>
                                        <span className="dropdown__label">
                                            {menu.label}
                                        </span>
                                    </Link>

                                ) :
                                    (<button onClick={()=> menu.click() } className="dropdown-item dropdown__item">
                                        <div className="dropdown__icon">
                                            {menu.icon}
                                        </div>
                                        <span className="dropdown__label">
                                            {menu.label}
                                        </span>
                                    </button>)
                                }
                            </React.Fragment>
                        )
                    })}
                </div>

            </DropdownMenu>
        </Dropdown>
    </>;
}

export default UserProfileMenu;