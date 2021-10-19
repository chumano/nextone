import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Channel from "./pages/channel/Channel";
import Home from "./pages/home/Home";
import {
    faHome,
    faAddressBook,
    faSnowflake,
    faMap,
    faTasks,
    faComments,
} from '@fortawesome/free-solid-svg-icons'
import MapConfig from "./pages/admin/map-config/MapConfig";
import Channels from "./pages/admin/channels/Channels";
import AuthLogin from "./components/auth/AuthLogin";
import Users from "./pages/admin/users/Users";
import AuthSilentCallback from "./components/auth/AuthSilentCallback";
import NotAuthenticated from "./components/auth/NotAuthenticated";
import AuthCallback from "./components/auth/AuthCallback";
import AuthRedirect from "./components/auth/AuthRedirect";
import { Redirect } from "react-router-dom";
import TestPage from "./pages/test/TestPage";
import ChatPage from "./pages/chat/ChatPage";
import MapPage from "./pages/map/MapPage";


const authRoutes: Array<{
    path: string,
    component: any,
    title: string
}> = [
        {
            path: "/auth/callback",
            component: AuthCallback,
            title: "Signin callback"
        },
        {
            path: "/auth/silent-callback",
            component: AuthSilentCallback,
            title: "Silent callback"
        },
        {
            path: "/auth/401",
            component: NotAuthenticated,
            title: "Not Authenticated"
        },
        // {
        //     path: "/auth/signout-callback",
        //     component: AuthLogin,
        //     title: "Login"
        // },
        {
            path: "/intro",
            component: AuthLogin,
            title: "Intro"
        },
        {
            path: "/auth/redirect",
            component: AuthRedirect,
            title: "Auth Redirect"
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
    //feature page
    {
        path: "/map",
        component: MapPage,
        useAuthLayout: true
    },
    {
        path: "/chat",
        component: ChatPage,
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
    },

    //test
    {
        path: "/test",
        component: TestPage,
        useAuthLayout: true
    }

];

const MenuList = [
    //feature meanu
    {
        id: 0,
        title: 'Trang chủ',
        path: '/home',
        icon: <FontAwesomeIcon icon={faHome} />
    },
    {
        id: 1,
        title: 'Bản đồ',
        path: '/map',
        icon: <FontAwesomeIcon icon={faMap} />
    },
    {
        id: 2,
        title: 'Tin nhắn',
        path: '/chat',
        icon: <FontAwesomeIcon icon={faComments} />
    },


    //manage menu
    {
        id: 100,
        title: 'Quản lý kênh',
        path: '/admin/channels',
        icon: <FontAwesomeIcon icon={faSnowflake} />
    },
    {
        id: 101,
        title: 'Quản lý người dùng',
        path: '/admin/users',
        icon: <FontAwesomeIcon icon={faAddressBook} />
    },
    {
        id: 102,
        title: 'Cấu hình bản đồ',
        path: '/admin/map-config',
        icon: <FontAwesomeIcon icon={faMap}/>
    },
    //Test components
    {
        id: 1000,
        title: 'Test components',
        path: '/test',
        icon: <FontAwesomeIcon icon={faTasks} />
    }
]

export { authRoutes, routes, MenuList };