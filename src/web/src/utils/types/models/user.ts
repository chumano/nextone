import { IChannel } from "./channel";

export interface IUser {
    id: string,
    name: string,
    phone?: string,
    email?: string,
    roles: IRole[],
    manageChannels: IChannel[],
}

export interface IRole {
    id: string,
    name: string
}

export const createNewUser = (): IUser => {
    return {
        id: "",
        name: "",
        roles: [],
        manageChannels: []
    };
}