import { Button, Dropdown, Menu, } from "antd";
import { PoweroffOutlined, DownOutlined , AppstoreOutlined} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from '../../assets/logo.svg'

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

                <div className="user-info">
                    <span>{user.Name}</span>
                </div>

                <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    onClick={logOut}>
                    Đăng xuất
                </Button>
            </div>
        </div>
    </>
}

export default MainHeader;