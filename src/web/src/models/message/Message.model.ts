import { EventInfo } from "../event/Event.model";
import { UserStatus } from "../user/UserStatus.model";
import { MessageFile } from "./MessageFile.model";
import { MessageType } from "./MessageType.model";

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;

  sentDate: string;
  userSender: UserStatus;

  content: string;
  files: MessageFile[];

  event?: EventInfo,

  isDeleted?: boolean,

  properites?: {
    'LOCATION'?: [number, number];
    'location'?: [number, number];
  }

  state?: 'upload' | 'error'; 
}
