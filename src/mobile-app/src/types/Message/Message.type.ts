import {EventInfo} from '../Event/EventInfo.type';
import {UserStatus} from './../User/UserStatus.type';

import {MessageFile} from './MessageFile.type';
import {MessageType} from './MessageType.type';

export interface MessageEvent {
  id: string;
  conversationId: string;
  type: MessageType;
  sentDate: string;
  userSender: UserStatus;
  content: string;
  files: MessageFile[];
  event?: EventInfo;
  state?: 'upload' | 'error';
}
