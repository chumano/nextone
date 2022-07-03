import {FileType} from './../types/File/FileType.type';
import {IPageOptions} from '../types/PageOptions.type';

export interface GetEventsByMeDTO extends IPageOptions {}

export interface GetEventsForMapDTO {
  EventTypeCodes: string[];
}

export interface GetEventsHistoryDTO extends IPageOptions {
  ChannelId: string;
}

export interface SendEventDTO {
  Content: string;
  EventTypeCode: string;
  OccurDate: string;

  Address: string;
  Lat: number;
  Lon: number;

  Files: SendEventFileDTO[];
}

export interface SendEventFileDTO {
  FileId: string;
  FileType: FileType;
  FileName: string;
  FileUrl: string;
}
