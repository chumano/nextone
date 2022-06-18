import { EventFile } from "../types/Event/EventFile.type";
import { FileType } from "../types/File/FileType.type";
import { MessageType } from "../types/Message/MessageType.type";

export const getMessageType = (contentType: string) => {
    if (contentType.startsWith("image/")) {
        return MessageType.ImageFile;
    }
    if (contentType.startsWith("video/")) {
        return MessageType.VideoFile;
    }
    if (contentType.startsWith("text/")) {
        return MessageType.OtherFile;
    }

    return MessageType.OtherFile
}

export const groupFileByType = (files: EventFile[]) => {
    let group: { 'image': EventFile[], 'other': EventFile[] } = { 'image': [], 'other': [] };
    for (const file of files) {
        if (file.fileType == FileType.Image) {
            group['image'].push(file);
        } else {
            group['other'].push(file);
        }
    }
    return group;
}