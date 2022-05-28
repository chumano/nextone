import { Modal, Progress, Image } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { FileZipOutlined} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { fileApi } from '../../../apis/fileApi';
import { Message } from '../../../models/message/Message.model'
import { sendMessage } from '../../../store/chat/chatThunks';
import { comApi } from '../../../apis/comApi';
import { chatActions } from '../../../store/chat/chatReducer';
import { IMAGE_FALLBACK } from '../../../utils';


export interface MessageUpload extends Message {
  uploadFile: File;
}

interface MessageUploadProps {
  message: MessageUpload
}
const MessageItemUpload: React.FC<MessageUploadProps> = ({ message }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imgPreviewSrc, setImgPreviewSrc] = useState<string>();
  const { uploadFile } = message;
  const isImage = uploadFile.type.startsWith("image/");

  const loadImage = useCallback(() => {
    var reader = new FileReader();
    var url = reader.readAsDataURL(message.uploadFile);
    reader.onloadend = (e) => {
      setImgPreviewSrc(reader.result as string);
    };
  }, [message]);

  useEffect(() => {
    const uploadFile = async () => {
      const file = message.uploadFile;
      const uploadResponse = await fileApi.uploadFiles([file], (progressEvent) => {
        console.log('upload_file', progressEvent.loaded, progressEvent)
        const progress = Math.round((100 * progressEvent.loaded) / progressEvent.total);
        setUploadProgress(progress);

      }, 'message');

      setUploadProgress(100);
      setIsUploading(false);

      if (!uploadResponse.isSuccess) {
        Modal.error({
          title: 'Có lỗi khi tải file',
          content: uploadResponse.errorMessage
        });
        return;
      }

      const uploadedFiles = uploadResponse.data;

      //send message
      const messageDto ={
        conversationId: message.conversationId!,
        content: '',
        files: uploadedFiles
      }
      const response = await comApi.sendMessage(messageDto);
      if(response.isSuccess){
        dispatch(chatActions.updateMessage({
          messageId: message.id,
          message: response.data
        }));
      }else{
        dispatch(chatActions.updateMessage({
          messageId: message.id,
          message: {
            ...message,
            state: 'error'
          }
        }));
      }
    }
    if (isImage) loadImage();
    uploadFile();
  }, [message])

  return (
    <div className='message-file-upload'>
      <div className='message-file-upload__file-preview'>
        {isImage && <Image
          width={'100%'}
          height={'100%'}
          src={imgPreviewSrc}
          fallback={IMAGE_FALLBACK}
        />
        }
        {!isImage &&
          <FileZipOutlined style={{fontSize:'30px'}}/>
        }
      </div>
      <div className='message-file-upload__file-info'>
        <div>
          {uploadFile.name}
        </div>
        <Progress percent={uploadProgress} size="small" />
      </div>
    </div>
  )
}

export default MessageItemUpload