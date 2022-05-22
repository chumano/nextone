import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faAddressBook,
	faSnowflake,
	faMap,
	faTasks,
	faComments,
	faNewspaper,
	faCog,
} from "@fortawesome/free-solid-svg-icons";
import ConfigPage from "./pages/admin/config/ConfigPage";
import Channels from "./pages/admin/channels/Channels";
import IntroPage from "./pages/intro/IntroPage";

import AuthSilentCallback from "./components/auth/AuthSilentCallback";
import NotAuthenticated from "./components/auth/NotAuthenticated";
import AuthCallback from "./components/auth/AuthCallback";
import AuthRedirect from "./components/auth/AuthRedirect";
import { Redirect } from "react-router-dom";
import Home from "./pages/home/Home";
import TestPage from "./pages/test/TestPage";
import ChatPage from "./pages/chat/ChatPage";
import MapPage from "./pages/map/MapPage";
import UserPage from "./pages/user/User";
import NewsList from "./pages/intro/NewsList";
import NewsPage from "./pages/news/NewsPage";
import AdminNewsPage from "./pages/admin/news/AdminNewsPage";

const authRoutes: Array<{
	path: string;
	component: any;
	title: string;
}> = [
	{
		path: "/auth/callback",
		component: AuthCallback,
		title: "Signin callback",
	},
	{
		path: "/auth/silent-callback",
		component: AuthSilentCallback,
		title: "Silent callback",
	},
	{
		path: "/auth/401",
		component: NotAuthenticated,
		title: "Not Authenticated",
	},
	// {
	//     path: "/auth/signout-callback",
	//     component: AuthLogin,
	//     title: "Login"
	// },
	{
		path: "/intro",
		component: IntroPage,
		title: "Giới thiệu",
	},
	{
		path: "/news/:id/:name",
		component: NewsPage,
		title: "Tin tức",
	},
	{
		path: "/auth/redirect",
		component: AuthRedirect,
		title: "Auth Redirect",
	},
];

export interface IRouteConfig {
	path: string;
	component: any;
	name?: string;
	title?: string;
	useAuthLayout?: boolean;
	exact?: boolean;
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
    //home
    {
        path: "/home",
        component: Home,
        useAuthLayout: true
    },
    //admin
    // {
    //     path: "/admin/users",
    //     component: UserPage,
    //     useAuthLayout: true
    // },
    // {
    //     path: "/admin/channels",
    //     component: Channels,
    //     useAuthLayout: true
    // },
    {
        path: "/admin/config",
        component: ConfigPage,
        useAuthLayout: true
    },
	//users
	{
		path: "/user",
		component: UserPage,
		useAuthLayout: true,
	},
	{
        path: "/admin/news",
        component: AdminNewsPage,
        useAuthLayout: true
    },
	//test
	{
		path: "/test",
		component: TestPage,
		useAuthLayout: true,
	},
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
        id: 20,
        title: 'Tin nhắn',
        path: '/chat',
        icon: <FontAwesomeIcon icon={faComments} />
    },
    {
        id: 30,
        title: 'Bản đồ',
        path: '/map',
        icon: <FontAwesomeIcon icon={faMap} />
    },
    {
        id: 90,
        title: 'Tin tức',
        path: '/admin/news',
        icon: <FontAwesomeIcon icon={faNewspaper} />
    },
	//manage menu
	// {
	// 	id: 100,
	// 	title: "Quản lý kênh",
	// 	path: "/admin/channels",
	// 	icon: <FontAwesomeIcon icon={faSnowflake} />,
	// },
	{
		id: 101,
		title: "Quản lý người dùng",
		path: "/user",
		icon: <FontAwesomeIcon icon={faAddressBook} />,
	},
	{
		id: 102,
		title: "Cấu hình",
		path: "/admin/config",
		icon: <FontAwesomeIcon icon={faCog} />,
	},
	//Test components
	{
		id: 1000,
		title: "Test components",
		path: "/test",
		icon: <FontAwesomeIcon icon={faTasks} />,
	},
];

export { authRoutes, routes, MenuList };
