import {BaseFile} from './../types/File/BaseFile.type';
import {MemberRole} from './../types/Conversation/ConversationMember.type';
import {ConversationType} from './../types/Conversation/ConversationType.type';
import {IPageOptions} from './../types/PageOptions.type';

export interface GetListConversationDTO extends IPageOptions {}

export interface CreateConversationDTO {
  name: string;
  type: ConversationType;
  memberIds: string[];
}

export interface AddMembersDTO {
  conversationId: string;
  memberIds: string[];
}

export interface RemoveMemberDTO {
  conversationId: string;
  userMemberId: string;
}

export interface UpdateMemberRoleDTO {
  conversationId: string;
  userMemberId: string;
  role: MemberRole;
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
