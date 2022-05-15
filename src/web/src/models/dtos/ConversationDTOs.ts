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

}

export interface AddMembersDTO {
    conversationId: string;
}

export interface RemoveMemberDTO {
    conversationId: string;
}

export interface UpdateMemberRoleDTO {
    conversationId: string;
}

export interface GetMessagesHistoryDTO extends IPageOptions {
    conversationId: string;
    beforeDate: string;
}

export interface SendMessageDTO {
    conversationId: string;
    content: string;

    files?: BaseFile[];
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
