import { FileType } from "./FileType.model";

export interface BaseFile {
  fileId: string;
  fileType: FileType;
  fileName: string;
  fileUrl: string;
}

