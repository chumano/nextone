import { UserStatus } from "../user/UserStatus.model";
import { EventFile } from "./EventFile.model";

export interface EventInfo {
  id: string;
  content: string;
  eventTypeCode: string;

  occurDate: string;

  address: string;
  lat: number;
  lon: number;

  channelId: string;
  userSenderId: string;
  userSender: UserStatus;

  files: EventFile[];
}