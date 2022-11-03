import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper'
import { conversationApi } from '../../apis';
import { fileApi } from '../../apis/fileApi';
import { AppDispatch } from '../../stores/app.store';
import { ApiResponse } from '../../types/ApiResponse.type';
import { Message } from '../../types/Message/Message.type';
import { handleAxiosApi } from '../../utils/axios.util';
import { useDispatch } from 'react-redux';
import { conversationActions } from '../../stores/conversation';
import { APP_THEME } from '../../constants/app.theme';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

export interface MessageUpload extends Message {
  uploadFile: {
    uri: string;
    name: string;
    type: string;
  };
}

interface MessageUploadProps {
  message: MessageUpload
}

const MessageItemUpload: React.FC<MessageUploadProps> = ({ message }) => {
  const dispatch: AppDispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imgPreviewSrc, setImgPreviewSrc] = useState<string>();
  const { uploadFile } = message;
  const isImage = uploadFile.type.startsWith("image/");

  useEffect(() => {
    const uploadFile = async () => {
      const file = message.uploadFile;
      const uploadResponse = await fileApi.uploadFiles([file], (progressEvent) => {
        //console.log('upload_file', progressEvent.loaded, progressEvent)
        const progress = Math.round((100 * progressEvent.loaded) / progressEvent.total);
        setUploadProgress(progress);

      }, 'message');

      setUploadProgress(100);

      if (!uploadResponse.isSuccess) {
        return;
      }

      const uploadedFiles = uploadResponse.data;

      //send message
      const messageDto = {
        conversationId: message.conversationId!,
        content: '',
        files: uploadedFiles
      }
      const response = await handleAxiosApi<ApiResponse<Message>>(conversationApi.sendMessage(messageDto));
      if (response.isSuccess) {
        dispatch(conversationActions.updateMessage({
          messageId: message.id,
          message: response.data
        }));
      } else {
        dispatch(conversationActions.updateMessage({
          messageId: message.id,
          message: {
            ...message,
            state: 'error'
          }
        }));
      }
    }
    uploadFile();
  }, [message])

  return (
    <View>
      {isImage &&
      <View style={styles.imageContainer}>
        <Image source={{ uri: uploadFile.uri }} style={styles.image} />
      </View>
      }
      {!isImage &&
        <View style={styles.fileContainer}>
          <AwesomeIcon name='file-alt' size={32} color={'#000'} />
        </View>
      }

      <Text>{uploadFile.name}</Text>
      <ProgressBar progress={uploadProgress} />
    </View>
  )
}

export default MessageItemUpload


const styles = StyleSheet.create({
  imageContainer: {
    width: 164,
    height: 164,
    padding: 5,
    borderWidth: 1,
    borderColor: APP_THEME.colors.black,
    borderRadius: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%'
  },
  fileContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: APP_THEME.colors.black,
    borderRadius: 10,
    position: 'relative'

},
});