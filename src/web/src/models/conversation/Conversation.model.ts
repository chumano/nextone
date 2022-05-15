import { Message } from "./../message/Message.model";
import { BaseListPagingRequest } from "./../apis/Request.model";
import { BaseObjectCRUD } from "../ObjectCRUD.model";

import { ConversationMember, MemberRole } from "./ConversationMember.model";
import { ConversationType } from "./ConversationType.model";
import { BaseFile } from "../file/File.model";

export interface Conversation extends BaseObjectCRUD {
  id: string;
  name: string;

  type: ConversationType;

  members: ConversationMember[];
  recentMessages: Message[];
}

export interface CreateConversationRequest {
  name: string;
  type: ConversationType;
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
  extends BaseListPagingRequest {
  conversationId: string;
  beforeDate: string;
}

export interface ConversationSendMessageRequest {
  conversationId: string;
  content: string;
  files: BaseFile[];
}
