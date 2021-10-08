import React, { useEffect, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import '../../styles/components/header/header-notification.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBell,
    faChevronDown
}  from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { displayHumanTime, randomDate } from "../../utils";

const notifications = [
    {
        id:1,
        title: 'Thông báo Thông báo 1',
        sentDateTime: randomDate()
    },
    {
        id:2,
        title: 'Thông báo Thông báo Thông báo 1',
        sentDateTime: randomDate()
    },
    {
        id:3,
        title: 'Thông báo Thông báo Thông báo1',
        sentDateTime: randomDate()
    },
    {
        id:4,
        title: 'Thông báo Thông báo Thông báo Thông báo1',
        sentDateTime: randomDate()
    },
    {
        id:5,
        title: 'Thông báo Thông báo Thông báo Thông báo1',
        sentDateTime: randomDate()
    },
    {
        id:6,
        title: 'Thông báo Thông báo Thông báo Thông báo Thông báo Thông báo Thông báo 1',
        sentDateTime: randomDate()
    },
    {
        id:7,
        title: 'Thông báo 1',
        sentDateTime: randomDate()
    }
];
const HeaderNotification : React.FC = ()=>{
    const [isOpen, setIsOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);
    useEffect(() => {
        setUnreadNotifications(notifications);
    }, []);;
   
    const date = new Date();
    date.setHours(1);
    const text = displayHumanTime(date);
    return <>
        <Dropdown isOpen={isOpen} toggle={()=> setIsOpen(!isOpen)}
        className="header-notification">
            <DropdownToggle onClick={()=> setIsOpen(!isOpen)}
                className="header-notification__toggle"
            >
                <div className="toggle__icon">
                    <FontAwesomeIcon icon={faBell}/>
                </div>
                <div className={"toggle__title" + (unreadNotifications.length>0?" unread":"")}> 
                    <span> {unreadNotifications.length} </span>
                    <span className="label">Thông báo</span>
                </div>
                <div className="toggle__down-icon">
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>
            </DropdownToggle>

            <DropdownMenu right={true} className="header-notification__dropdown">
                <div onClick={()=>setIsOpen(!isOpen)}>
                    <div className="dropdown-head">
                        <span className="dropdown-head__title">Thông báo</span>

                        <Link to={'/notifications'} className="dropdown-head__link">
                            Tất cả
                        </Link>
                    </div>

                    <div className="dropdown-body">
                        {unreadNotifications.length !==0 ?
                        (
                            unreadNotifications.map((notification)=>{
                                return (<React.Fragment key={notification.id} >
                                    <div className="notification-item">
                                        <div className="notification-item__left">
                                            <div className="notification-item__status"></div>
                                            <div className="notification-item__content">
                                                {notification.title}
                                            </div>
                                        </div>
                                       
                                        <span className="notification-item__time">
                                            {displayHumanTime(notification.sentDateTime)}
                                        </span>
                                    </div>
                                </React.Fragment>)
                            })
                        ): (
                            <div className="no-notifications">
                                <span> Không có thông báo mới </span>
                            </div>
                            
                        )}
                    </div>
                </div>
            </DropdownMenu>
        </Dropdown>
    </>;
}

export default HeaderNotification;