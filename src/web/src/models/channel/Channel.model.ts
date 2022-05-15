import { BaseFile } from "./../file/File.model";
export interface Channel {
  id: string;
  name: string;
  allowedEventTypeCodes: string[];
  recentEvents: any;
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

  files: BaseFile[];
}
