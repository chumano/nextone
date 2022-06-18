import { FileType } from "./FileType.type";

export interface BaseFile {
    fileId: string;
    fileType: FileType;
    fileName: string;
    fileUrl: string;
}