import { IUser } from "../utils";
import { http } from "../utils/http-common";
const FakeUserList:IUser[]= [
    {
        id: "id1",
        name :"Loc Hoang",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id2",
        name :"Loc Hoang 2",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id3",
        name :"Loc Hoang 3",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id4",
        name :"Loc Hoang 4",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    }
];

class UserService {
    pathUrl: string = "/users";
    constructor() {
    }

    getAll = () => {
        return new Promise<any>((resolve) => {
            resolve( {data: FakeUserList });
        });
        //http.get(this.pathUrl);
    }

    get = (id: string) => {
        return http.get(`${this.pathUrl}/${id}`);
    }

    create = (data: IUser) => {
        return http.post(`${this.pathUrl}`, data);
    }

    update = (data: IUser) => {
        return http.put(`${this.pathUrl}}`, data);
    }

    delete = (id: string) => {
        return http.delete(`${this.pathUrl}/${id}`);
    }

    findBy = (filters: any) => {
        //TODO : filters to url parameters
        return http.get(`${this.pathUrl}?${filters}`);
    }
}

export default new UserService();