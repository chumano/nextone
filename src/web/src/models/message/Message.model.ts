import { MessageFile } from "./MessageFile.model";
import { MessageType } from "./MessageType.model";

export interface Message {
  Id: string;
  ConversationId: string;
  Type: MessageType;

  SentDate: string;
  UserSenderId: string;
  UserSender: any;

  Content: string;
  Files: MessageFile[];
}
