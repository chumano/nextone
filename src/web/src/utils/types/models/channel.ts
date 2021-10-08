export interface IChannel{
    id: string,
    name: string,
    chanelType: IChannelType,
    users: IUserChannelMembership
}

export interface IChannelType{
    id:string,
    name: string
}

export enum ChannelMemberTypes{
    Manager = "manager",
    Member = "member"
}

export interface IUserChannelMembership{
    userId: string,
    userName: string,
    memberType: ChannelMemberTypes
}