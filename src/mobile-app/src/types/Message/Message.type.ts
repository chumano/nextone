import {EventInfo} from '../Event/EventInfo.type';
import {UserStatus} from './../User/UserStatus.type';

import {MessageFile} from './MessageFile.type';
import {MessageType} from './MessageType.type';

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  sentDate: string;
  userSender: UserStatus;
  content: string;
  files: MessageFile[];
  event?: EventInfo;
  
  properites?: {
    'LOCATION'?: [number, number]
  }

  state?: 'upload' | 'error';
}
