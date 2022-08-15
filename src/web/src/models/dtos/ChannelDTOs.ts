import { IPageOptions } from "../apis/PageOptions.model";

export interface CreateChannelDTO{
    name: string;
    memberIds: string[];
    eventTypeCodes: string[];
    parentId?: string;
}
export interface GetListChannelDTO extends IPageOptions {

}
export interface UpdateEventTypesChannelDTO{

}

export interface GetEventsHistoryDTO{
    channelId: string;
    beforeDate?: string;

    offset:number;
    pageSize:number;
}

export interface SendEventDTO{

}