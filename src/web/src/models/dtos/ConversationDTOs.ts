import { IPageOptions } from "../apis/PageOptions.model";
import { MemberRole } from "../conversation/ConversationMember.model";
import { ConversationType } from "../conversation/ConversationType.model";
import { BaseFile } from "../file/File.model";

export interface CreateConverationDTO {
    name: string,
    type: ConversationType,
    memberIds: string[]
}

export interface GetListConversationDTO extends IPageOptions {
    isExcludeChannel: boolean
}

export interface AddMembersDTO {
    conversationId: string;
    memberIds: string[];
}

export interface RemoveMemberDTO {
    conversationId: string;
    userMemberId:string;
}

export interface UpdateMemberRoleDTO {
    conversationId: string;
    userMemberId: string;
    role: MemberRole
}

export interface GetMessagesHistoryDTO extends IPageOptions {
    conversationId: string;
    beforeDate: string;
}

export interface SendMessageDTO {
    conversationId: string;
    userId?: string; 
    content: string;

    files?: BaseFile[];
    properties?: {[key:string] : any}
}

export interface SendMessage2UsersDTO {
    userIds: string[]; 
    content: string;

    files?: BaseFile[];
    properties?: {[key:string] : any}
}

export interface SendMessage2ConversationsDTO {
    conversationIds: string[]; 
    content: string;

    files?: BaseFile[];
    properties?: {[key:string] : any}
}

export interface CreateConversationRequest {
    name: string;
    Type: ConversationType;
    memberIds: string[];
}

export interface ConversationAddMemberRequest {
    conversationId: string;
    memberIds: string[];
}

export interface ConversationRemoveMemberRequest {
    conversationId: string;
    memberIds: string[];
}

export interface ConversationUpdateMemberRoleRequest {
    conversationId: string;
    userMemberId: string;
    memberRole: MemberRole;
}

export interface ConversationGetMessageHistoryRequest
    extends IPageOptions {
    conversationId: string;
    beforeDate: string;
}
