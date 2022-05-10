import { Button, Dropdown, Menu, } from "antd";
import { PoweroffOutlined, DownOutlined , AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../../assets/logo.svg'
import { useState } from "react";
import ModalSettings from "../modals/settings/ModalSettings";

const AntD= {
    Dropdown :Dropdown as any,
    Menu : Menu 
}

const menu = (
    <AntD.Menu >
         <Menu.Item key="0">
            <a href="/maps" style={{"minWidth": '200px'}}>UCom</a>
        </Menu.Item>
        {/* <Menu.Divider /> */}
       
    </AntD.Menu>
);

const MainHeader: React.FC = (props: any) => {
    const user = {
        Name: 'Chumano'
    }
    const [showModalSettings, setShowModalSettings] = useState(false);

    const logOut = () => {

    }
    return <>
        <div className="main-header">
            <div className="main-header__logo-container">
                <Logo />
            </div>
            <div className="main-header__app-title">
                Map
            </div>

            <div className="main-header__nav">
                <Link className="link" to="/maps">Maps</Link>

                <Link className="link" to="/data">Data Sources</Link>

                {/* <Link className="link" to="/maps/new">Map Editor</Link> */}
            </div>

            <div className="flex-spacer"></div>

            <div className="main-header__right">
           

                <AntD.Dropdown overlay={menu} trigger={['click']} >
                    <div className="nav-links-btn clickable">
                        <AppstoreOutlined />
                    </div>
                </AntD.Dropdown>

                <div className="nav-links-btn clickable"  
                    onClick={()=>{
                        setShowModalSettings(true);
                    }}>
                    <SettingOutlined />
                </div>

                <div className="user-info">
                    <span>{user.Name}</span>
                </div>

                {/* <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    onClick={logOut}>
                    Đăng xuất
                </Button> */}
                <div className="nav-links-btn clickable" title="Đăng xuất"
                    onClick={logOut}>
                    <PoweroffOutlined style={{color:"#ff7875"}}/>
                </div>
                
            </div>
        </div>

        {showModalSettings &&
            <ModalSettings  onClose={()=>{
                setShowModalSettings(false);
            }}/>
        }
    </>
}

export default MainHeader;