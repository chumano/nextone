import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Channel from "./pages/channel/Channel";
import Home from "./pages/home/Home";
import { faHome,
     faAddressBook,
     faSnowflake,
     faMap
} from '@fortawesome/free-solid-svg-icons'
import MapConfig from "./pages/admin/map-config/MapConfig";
import Channels from "./pages/admin/channels/Channels";
import AuthLogin from "./pages/auth-login/AuthLogin";
import AuthCallback from "./pages/auth-callback/AuthCallback";



export interface IRouteConfig {
    path: string,
    component: any,
    name?: string,
    title?: string,
    useAuthLayout?: boolean,
    exact?: boolean
}
const routes: Array<IRouteConfig> = [
    //common
    {
        path: "/auth/callback",
        component: AuthCallback,
        useAuthLayout: true
    },
    {
        path: "/auth/login",
        component: AuthLogin,
        useAuthLayout: true
    },

    //channel manager
    {
        path: "/home",
        component: Home,
        useAuthLayout: true
    },
    {
        path: "/channel",
        component: Channel,
        useAuthLayout: true
    },

    //admin
    {
        path: "/admin/users",
        component: Home,
        useAuthLayout: true
    },
    {
        path: "/admin/channels",
        component: Channels,
        useAuthLayout: true
    },
    {
        path: "/admin/map-config",
        component: MapConfig,
        useAuthLayout: true
    }

];

const MenuList = [
    {
        id:0,
        title:'Trang chủ',
        path: '/home',
        icon: <FontAwesomeIcon icon={faHome} />
    },
    {
        id:1,
        title:'Quản lý kênh',
        path: '/admin/channels',
        icon: <FontAwesomeIcon icon={faSnowflake} />
    },
    {
        id:2,
        title:'Quản lý người dùng',
        path: '/admin/users',
        icon: <FontAwesomeIcon icon={faAddressBook} />
    },
    {
        id:3,
        title:'Cấu hình bản đồ',
        path: '/admin/map-config',
        icon: <FontAwesomeIcon icon={faMap} />
    }
]

export { routes, MenuList };