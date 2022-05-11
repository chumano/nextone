export interface Channel {
  Id: string;
  Name: string;
  AllowedEventTypeCodes: string[];
  RecentEvents: any;
}

export interface CreateChannelRequest {
  Name: string;
  MemberIds: string[];
  EventTypeCodes: string[];
}

export interface UpdateEventTypesChannelRequest {
  ChannelId: string;
  Name: string;
  EventTypeCodes: string[];
}

export interface SendEventToChannelRequest {
  Content: string;
  EventTypeCode: string;
  OccurDate: string;

  Address: string;
  Lat: number;
  Lon: number;

  Files: SendEventFileToChannelRequest[];
}

export interface SendEventFileToChannelRequest {
  FileId: string;
  FileType: string;
  FileUrl: string;
}
