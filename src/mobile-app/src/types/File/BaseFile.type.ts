import { FileType } from "./FileType.type";

export interface BaseFile {
    file: string;
    fileType: FileType;
    fileName: string;
    fileUrl: string;
}