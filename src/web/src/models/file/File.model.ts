import { FileType } from "./FileType.model";

export interface BaseFile {
  fileId: string;
  fileType: FileType;
  fileUrl: string;
}

