import {UserStatus} from './../User/UserStatus.type';
import {EventFile} from './EventFile.type';

export interface EventInfo {
  id: string;
  content: string;
  eventTypeCode: string;
  eventType: string;
  occurDate: string;
  address: string;
  lat: number;
  lon: number;
  channelId: string;
  userSenderId: string;
  userSender: UserStatus;
  files: EventFile[];
}
