import { MessageType } from "../../models/message/MessageType.model";

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