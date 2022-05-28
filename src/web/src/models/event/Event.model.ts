import { UserStatus } from "../user/UserStatus.model";
import { EventFile } from "./EventFile.model";
import { EventType } from "./EventType.model";

export interface EventInfo {
  id: string;
  content: string;
  eventTypeCode: string;
  eventType: EventType;

  occurDate: string;

  address: string;
  lat: number;
  lon: number;

  channelId: string;
  userSenderId: string;
  userSender: UserStatus;

  files: EventFile[];
}