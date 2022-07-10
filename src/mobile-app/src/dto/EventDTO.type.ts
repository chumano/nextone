import {FileType} from './../types/File/FileType.type';
import {IPageOptions} from '../types/PageOptions.type';
import { BaseFile } from '../types/File/BaseFile.type';

export interface GetEventsByMeDTO extends IPageOptions {
  loadMore?: boolean
}

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

  Files: BaseFile[];
}

