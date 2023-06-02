import React, {useCallback, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {IconButton, TextInput} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {getMessageType} from '../../utils/file.utils';
import {MessageUpload} from '../Message/MessageItemUpload';
import {Conversation} from '../../types/Conversation/Conversation.type';
import {nowDate} from '../../utils/date.utils';
import {UserStatus} from '../../types/User/UserStatus.type';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {conversationActions} from '../../stores/conversation';
import AudioRecorder from './AudioRecorder';
import RNFetchBlob from 'rn-fetch-blob';
import {MessageType} from '../../types/Message/MessageType.type';
import * as mime from 'react-native-mime-types';
import ImageActionPicker, {ImageInfo} from './ImageActionPicker';

interface IProps {
  conversation: Conversation;
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<IProps> = ({conversation, onSendMessage}) => {
  const dispatch: AppDispatch = useDispatch();
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const [isKeyPress, setIsKeyPress] = useState(false);
  const [sendBtnVisible, setSendBtnVisible] = useState(false);
  const [message, setMessage] = useState('');

  const onKeyPressHandler = () => {
    setIsKeyPress(true);
  };

  const onChangeTextHandler = (text: string) => {
    if (text.length > 0) {
      setSendBtnVisible(true);
    } else {
      setSendBtnVisible(false);
    }
    setMessage(text);
  };

  const sendMessageHandler = () => {
    onSendMessage(message);
    setMessage('');
    setSendBtnVisible(false)
  };

  const send = useCallback(
    (
      asset: {
        uri: string;
        fileName: string;
        type: string;
      },
      msgType?: MessageType,
    ) => {
      const messageType = msgType || getMessageType(asset.type!);
      const fakeid = 'fake-' + new Date().toString();
      const message: MessageUpload = {
        conversationId: conversation.id,
        type: messageType,
        uploadFile: {
          uri: asset.uri!,
          name: asset.fileName!,
          type: asset.type!,
        },
        state: 'upload',
        id: fakeid,
        content: '',
        sentDate: nowDate(),
        userSender: {
          userId: userInfo?.userId,
        } as UserStatus,
        files: [],
      };
      //console.log('message upload', message)
      //add temp message
      dispatch(conversationActions.addTempMessage(message));
    },
    [dispatch, conversation],
  );

  const pickFile = useCallback(async () => {
    try {
      const result = await DocumentPicker.pickMultiple({
        allowMultiSelection: true,
        type: [
          Platform.OS === 'ios' ? 'public.mp3' : 'audio/mpeg',
          DocumentPicker.types.audio,
          DocumentPicker.types.video,
          DocumentPicker.types.pdf,
          DocumentPicker.types.csv,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.plainText,
          DocumentPicker.types.zip,
        ],
      });
      //console.log('pickFile' , result)
      for (let i = 0; i < result.length; i++) {
        setTimeout(() => {
          const file = result[i];
          send({
            uri: file.uri,
            fileName: file.name,
            type: file.type!,
          });
        }, i * 500);
      }
    } catch (e) {
      console.error('pickFile', e);
    }
  }, [send]);

  const pickImage = useCallback(async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      selectionLimit: 5,
    };
    const result = await launchImageLibrary(options);
    //console.log('pickImage' , result)
    //add UploadMessage
    const {assets} = result;
    if (!assets) {
      return;
    }
    for (let i = 0; i < assets.length; i++) {
      setTimeout(() => {
        const file = assets[i];
        send({
          uri: file.uri!,
          fileName: file.fileName!,
          type: file.type!,
        });
      }, i * 500);
    }
  }, [send]);

  const onPickedImage = useCallback(
    async (imgs: ImageInfo[]) => {
      for (let i = 0; i < imgs.length; i++) {
        setTimeout(() => {
          const file = imgs[i];
          send({
            uri: file.uri,
            fileName: file.fileName,
            type: file.type,
          });
        }, i * 500);
      }
    },
    [send],
  );

  const [imagePickerEnabled, setImagePickerEnabled] = useState(false);
  const onToggleImagePicker = useCallback(async () => {
    setImagePickerEnabled(state => !state);
    setRecodingEnabled(false);
  }, []);

  const [recordingEnabled, setRecodingEnabled] = useState(false);
  const onToggleRecording = useCallback(async () => {
    setRecodingEnabled(state => !state);
    setImagePickerEnabled(false);
  }, []);

  const onAudioRecorded = useCallback(
    (uri: string) => {
      //console.log('onAudioRecorded', uri)

      if (Platform.OS === 'ios') {
        uri = uri.replace('file://', '');
      }

      RNFetchBlob.fs.stat(uri).then(file => {
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        //console.log('onAudioRecorded', file)
        send(
          {
            uri: uri,
            fileName: file.filename,
            type: mime.contentType(file.filename), //'audio/mpeg'
          },
          MessageType.AudioFile,
        );
      });
    },
    [send],
  );

  return (
    <View style={styles.chatInputContainer}>
      <View style={styles.chatInputInnerContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            mode={'flat'}
            style={styles.txtInput}
            underlineColor={'transparent'}
            activeUnderlineColor={'transparent'}
            selectionColor={APP_THEME.colors.accent}
            onChangeText={onChangeTextHandler}
            onKeyPress={onKeyPressHandler}
            multiline={true}
            numberOfLines={3}
            placeholder="Tin nhắn"
            value={message}
          />
        </View>
        {sendBtnVisible ? (
          <View style={styles.iconButtonsContainer}>
            <View style={styles.iconButtonContainer}>
              <IconButton
                onPress={sendMessageHandler}
                style={styles.button}
                icon="send"
                size={20}
                color={APP_THEME.colors.accent}
              />
            </View>
          </View>
        ) : (
          <View style={styles.iconButtonsContainer}>
            <View style={styles.iconButtonContainer}>
              <IconButton
                style={styles.button}
                icon="paperclip"
                size={20}
                onPress={pickFile}
                color={APP_THEME.colors.accent}
              />
            </View>
            <View style={styles.iconButtonContainer}>
              <IconButton
                style={styles.button}
                icon="file-image"
                size={20}
                onPress={onToggleImagePicker}
                color={APP_THEME.colors.accent}
              />
            </View>
            <View style={styles.iconButtonContainer}>
              <IconButton
                icon="microphone"
                size={20}
                onPress={onToggleRecording}
                color={
                  recordingEnabled
                    ? APP_THEME.colors.red
                    : APP_THEME.colors.accent
                }
              />
            </View>
          </View>
        )}
      </View>

      <AudioRecorder
        recordingEnabled={recordingEnabled}
        onRecorded={onAudioRecorded}
      />
      {imagePickerEnabled && <ImageActionPicker onPicked={onPickedImage} />}
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  chatInputContainer: {
    backgroundColor: APP_THEME.colors.primary,
    paddingLeft: 8,
    minHeight: 64,
    justifyContent: 'center',
  },
  chatInputInnerContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
    
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButtonContainer: {
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  txtInput: {
    backgroundColor: APP_THEME.colors.primary,
    maxHeight: 48
  },
  button: {
    marginRight: APP_THEME.spacing.between_component,
  },
});
