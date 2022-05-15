import { Message } from "./../message/Message.model";

import { ConversationMember, MemberRole } from "./ConversationMember.model";
import { ConversationType } from "./ConversationType.model";
import { BaseFile } from "../file/File.model";
import { IPageOptions } from "../apis/PageOptions.model";

export interface Conversation {
  id: string;
  name: string;

  type: ConversationType;

  members: ConversationMember[];
  messages: Message[];

  updatedDate?: string;
}
