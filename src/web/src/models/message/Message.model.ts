import { MessageFile } from "./MessageFile.model";
import { MessageType } from "./MessageType.model";

export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;

  sentDate: string;
  userSenderId: string;
  userSender: any;

  content: string;
  files: MessageFile[];
}
