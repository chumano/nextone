import { Message } from "./../message/Message.model";
import { BaseListPagingRequest } from "./../apis/Request.model";
import { BaseObjectCRUD } from "../ObjectCRUD.model";

import { ConversationMember, MemberRole } from "./ConversationMember.model";
import { ConversationType } from "./ConversationType.model";
import { BaseFile } from "../file/File.model";

export interface Conversation extends BaseObjectCRUD {
  Id: string;
  Name: string;

  Type: ConversationType;

  Members: ConversationMember[];
  RecentMessages: Message[];
}

export interface CreateConversationRequest {
  Name: string;
  Type: ConversationType;
  MemberIds: string[];
}

export interface ConversationAddMemberRequest {
  ConversationId: string;
  MemberIds: string[];
}

export interface ConversationRemoveMemberRequest {
  ConversationId: string;
  MemberIds: string[];
}

export interface ConversationUpdateMemberRoleRequest {
  ConversationId: string;
  UserMemberId: string;
  MemberRole: MemberRole;
}

export interface ConversationGetMessageHistoryRequest
  extends BaseListPagingRequest {
  ConversationId: string;
  BeforeDate: string;
}

export interface ConversationSendMessageRequest {
  ConversationId: string;
  Content: string;
  Files: BaseFile[];
}
