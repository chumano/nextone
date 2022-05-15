import { BaseObjectCRUD } from "../ObjectCRUD.model";
import { EventFile } from "./EventFile.model";

export interface Event extends BaseObjectCRUD {
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