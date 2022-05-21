
import { Conversation } from "../conversation/Conversation.model";
import { EventType } from "../event/EventType.model";

export interface Channel extends Conversation {
  id: string;
  name: string;
  allowedEventTypes: EventType[];
  events: any;
}

export interface CreateChannelRequest {
  name: string;
  memberIds: string[];
  eventTypeCodes: string[];
}

export interface UpdateEventTypesChannelRequest {
  channelId: string;
  name: string;
  eventTypeCodes: string[];
}

export interface SendEventToChannelRequest {
  content: string;
  eventTypeCode: string;
  occurDate: string;

  address: string;
  lat: number;
  lon: number;

  files: SendEventFileToChannelRequest[];
}

export interface SendEventFileToChannelRequest {
  fileId: string;
  fileType: string;
  fileUrl: string;
}
