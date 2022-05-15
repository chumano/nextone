import { EventFile } from "./EventFile.model";

export interface Event {
  id: string;
  content: string;
  eventTypeCode: string;

  occurDate: string;

  address: string;
  lat: number;
  lon: number;

  channelId: string;
  userSenderId: string;
  userSender: any;

  files: EventFile[];
}