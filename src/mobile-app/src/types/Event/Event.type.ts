import {EventFile} from './EventFile.type';
import {EventType} from './EventType.type';
import {UserStatus} from './../User/UserStatus.type';

export interface Event {
  id: string;
  content: string;
  eventTypeCode: string;
  occurDate: string;
  createdDate: string;

  address: string;
  lat: number;
  lon: number;

  userSenderId: string;
  userSender: UserStatus;

  eventType: EventType;
  files: EventFile[];

  isActive: boolean;
  isDeleted: boolean;
}
