import { IPageOptions } from "../apis/PageOptions.model";

export interface CreateChannelDTO{
    name: string,
    memberIds: string[]
}
export interface GetListChannelDTO extends IPageOptions {

}
export interface UpdateEventTypesChannelDTO{

}

export interface GetEventsHistoryDTO{

}

export interface SendEventDTO{

}