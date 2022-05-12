import { FileType } from "./FileType.model";

export interface BaseFile {
  FileId: string;
  FileType: FileType;
  FileUrl: string;
}

