import { IPageOptions } from "../apis/PageOptions.model";
import { ConversationType } from "../conversation/ConversationType.model";
import { BaseFile } from "../file/File.model";

export interface CreateConverationDTO{
    name:string,
    type: ConversationType,
    memberIds: string[]
}

export interface GetListConversationDTO extends IPageOptions{
    
}

export interface AddMembersDTO{
    conversationId: string;
}

export interface RemoveMemberDTO{
    conversationId: string;
}

export interface UpdateMemberRoleDTO{
    conversationId: string;
}

export interface GetMessagesHistoryDTO  extends IPageOptions{
    conversationId: string;
}

export interface SendMessageDTO{
    conversationId: string;
    content:string;

   files: BaseFile[];
}