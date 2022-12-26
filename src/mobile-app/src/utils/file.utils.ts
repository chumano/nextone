import { PermissionsAndroid, Platform } from "react-native";
import { EventFile } from "../types/Event/EventFile.type";
import { FileType } from "../types/File/FileType.type";
import { MessageType } from "../types/Message/MessageType.type";

export const getMessageType = (contentType: string) : MessageType=> {
    if (contentType.startsWith("image/")) {
        return MessageType.ImageFile;
    }
    if (contentType.startsWith("video/")) {
        return MessageType.VideoFile;
    }
    if (contentType.startsWith("text/")) {
        return MessageType.OtherFile;
    }
    if (contentType.startsWith("audio/")) {
        return MessageType.AudioFile;
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

export const requestCameraPermission = async (
  ) => {
    if(Platform.OS==='ios') return undefined;

    let granted: any = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    //console.log('requestCameraPermission', granted)
    if (granted) {
       return granted
    } else {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        
      } 

      return granted;
    }
  };