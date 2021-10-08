import { AxiosResponse } from "axios";
import { FakeUserList, IUser } from "../utils";
import { http } from "../utils/http-common";

const createFakeResponse = <T>(data: T): AxiosResponse<T> => {
    return {
        status: 200,
        statusText: "",
        headers: {} as any,
        config: {} as any,
        data
    }
}
class UserService {
    pathUrl: string = "/users";
    constructor() {
    }

    getAll = () => {
        return new Promise<AxiosResponse<{ total: number, items: IUser[] }>>((resolve) => {
            setTimeout(() => {
                resolve(createFakeResponse({
                    total: 100,
                    items: FakeUserList
                }));
            }, 1000)

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
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const total = FakeUserList.length;
        const items = FakeUserList.slice((page - 1) * pageSize, page * pageSize);;
        return new Promise<AxiosResponse<{ total: number, items: IUser[] }>>((resolve) => {
            setTimeout(() => {
                resolve(createFakeResponse({
                    total: total,
                    items: items
                }));
            }, 2000);
        });
        //return http.get(`${this.pathUrl}?${filters}`);
    }
}

export default new UserService();