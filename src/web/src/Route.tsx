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
import AuthLogin from "./components/auth/AuthLogin";
import Users from "./pages/admin/users/Users";
import AuthSilentCallback from "./components/auth/AuthSilentCallback";
import NotAuthenticated from "./components/auth/NotAuthenticated";
import AuthCallback from "./components/auth/AuthCallback";


const authRoutes: Array<{
    path: string,
    component: any,
    title: string
}> = [
    {
        path : "/auth/callback",
        component : AuthCallback,
        title : "Signin callback"
    },
    {
        path : "/auth/silent-callback",
        component : AuthSilentCallback,
        title : "Silent callback"
    },
    {
        path : "/auth/401",
        component : NotAuthenticated,
        title : "Not Authenticated"
    },
    {
        path: "/auth/login",
        component: AuthLogin,
        title: "Login"
    },

]

export interface IRouteConfig {
    path: string,
    component: any,
    name?: string,
    title?: string,
    useAuthLayout?: boolean,
    exact?: boolean
}
const routes: Array<IRouteConfig> = [
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
        component: Users,
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

export { authRoutes, routes, MenuList };