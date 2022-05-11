export interface BaseFile {
  FileId: string;
  FileType: FileType;
  FileUrl: string;
}

export enum FileType {
  Image,
  Video,
  TextFile,
  Other,
}
