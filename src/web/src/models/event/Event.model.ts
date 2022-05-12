import { BaseObjectCRUD } from "../ObjectCRUD.model";
import { EventFile } from "./EventFile.model";

export interface Event extends BaseObjectCRUD {
  Id: string;
  Content: string;
  EventTypeCode: string;

  OccurDate: string;

  Address: string;
  Lat: number;
  Lon: number;

  ChannelId: string;
  UserSenderId: string;
  UserSender: any;

  Files: EventFile[];
}