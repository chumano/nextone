import Channel from "./pages/channel/Channel";
import Home from "./pages/home/Home";

export interface IRouteConfig {
    path: string,
    component: any,
    name?: string,
    title?: string,
    useAuthLayout?: boolean,
    exact?: boolean
}
const routes: Array<IRouteConfig> = [
    {
        path: "/auth/callback",
        component: {}
    },
    {
        path: "/auth/login",
        component: {}
    },
    //chanel manager
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
        component: {}
    },
    {
        path: "/admin/chanels",
        component: {}
    }

];

export { routes };