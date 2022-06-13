import {Message} from '../Message/Message.type';
import {ConversationMember} from './ConversationMember.type';
import {ConversationType} from './ConversationType.type';

export interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  members: ConversationMember[];
  messages: Message[];
  updatedDate?: string;
}
