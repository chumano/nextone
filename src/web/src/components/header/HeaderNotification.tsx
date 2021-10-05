import { useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import '../../styles/components/header/header-notification.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBell,
    faChevronDown
}  from "@fortawesome/free-solid-svg-icons";

const HeaderNotification : React.FC = ()=>{
    const [isOpen, setIsOpen] = useState(false)
    return <>
        <Dropdown isOpen={isOpen} toggle={()=> setIsOpen(!isOpen)}
        className="header-notification">
            <DropdownToggle onClick={()=> setIsOpen(!isOpen)}
                className="header-notification__toggle"
            >
                <div className="toggle__icon">
                    <FontAwesomeIcon icon={faBell}/>
                </div>
                <div className="toggle__title"> 
                    1 Thông báo
                </div>
                <div className="toggle__down-icon">
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>
            </DropdownToggle>

            <DropdownMenu right={true}>

            </DropdownMenu>
        </Dropdown>
    </>;
}

export default HeaderNotification;