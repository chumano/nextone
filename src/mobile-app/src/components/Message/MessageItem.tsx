import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { APP_THEME } from '../../constants/app.theme';

import UserAvatar from '../User/UserAvatar';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import { Message } from '../../types/Message/Message.type';
import { useSelector } from 'react-redux';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import FileView from '../File/FileView';
import { MessageType } from '../../types/Message/MessageType.type';
import MessageEvent from './MessageEvent';
import { frowNow } from '../../utils/date.utils';
import FileList from '../File/FileList';
import { ImageSource } from 'react-native-vector-icons/Icon';
import { FileType } from '../../types/File/FileType.type';
import ImageView from 'react-native-image-viewing';
import ImageViewHeader from '../ImageView/ImageViewHeader';
import ImageViewFooter from '../ImageView/ImageViewFooter';
import { ConversationType } from '../../types/Conversation/ConversationType.type';
import { useNavigation } from '@react-navigation/native';
import { MapScreenProp } from '../../navigation/MapStack';
import MessageItemUpload, { MessageUpload } from './MessageItemUpload';
import AudioPlayer from '../Player/AudioPlayer';
import { MemberRole } from '../../types/Conversation/ConversationMember.type';

interface IProps {
  message: Message;
  conversationType: ConversationType;
  onPlaying?: (id: string) => void;
  playingId?: string;
  userRole?:MemberRole,
  onSelectMessage?: ()=>void,
  isSelected?: boolean
}

const MessageItem: React.FC<IProps> = ({
  message,
  conversationType,
  onPlaying,
  playingId,
  userRole,
  onSelectMessage,
  isSelected
}) => {
  const authState = useSelector((store: IAppStore) => store.auth);
  const navigation = useNavigation<any>();
  const isOwnerMessage = authState.data?.userId === message.userSender.userId ?? false;

  const userAvatar =
    message.userSender.userAvatarUrl !== '' ? (
      <UserAvatar imageUri={message.userSender.userAvatarUrl} size={24} />
    ) : (
      <Avatar.Icon icon="account" size={24} />
    );

  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [images, setImages] = useState<ImageSource[]>([]);

  const fileImages = useMemo(() => {
    return message.files?.filter(o => o.fileType === FileType.Image) || [];
  }, [message.files]);

  const onViewImage = useCallback(
    (index: number) => {
      const images = fileImages;
      return () => {
        const imageSoruces: ImageSource[] = images.map(o => {
          return {
            title: 'Hình ảnh',
            uri: o.fileUrl,
          };
        });
        setImages(imageSoruces);
        setSelectedImageIndex(index);
        setImageViewVisible(true);
      };
    },
    [fileImages],
  );

  const { isDeleted } = message;

  const onSelectedMessageHandle = useCallback(()=>{
    !isDeleted && onSelectMessage && onSelectMessage()
  },[isDeleted, onSelectMessage])

 
  const displayDate = frowNow(message.sentDate);
  const properties = message.properites;
  const location = properties
    ? properties['LOCATION'] || properties['location']
    : undefined;

  const gotoMapLocation = (location: [number, number]) => {
    //window.location.href = `/map?lat=${location[0]}&lon=${location[1]}` ;
    navigation.navigate('MapTab', {
      screen: 'Map',
      params: { position: location },
    });
  };
 

  return (
    <React.Fragment>
      {message.type == MessageType.Event && (
        <View>
          <MessageEvent message={message} />
        </View>
      )}

      {message.type !== MessageType.Event && (
        <View
          style={[
            styles.messageContainer,
            isOwnerMessage && styles.ownerMessageContainer,
            isSelected && styles.selectedMessageContainer,
          ]}>

          {/* User Sender */}

          <View style={{marginBottom: 8, alignItems: 'center',
            flexBasis:'100%',
            flexDirection : !isOwnerMessage?'row': 'row-reverse'
          }}>
            {!isOwnerMessage && userAvatar}

            {conversationType !== ConversationType.Peer2Peer &&
              !isOwnerMessage && (
                <Text style={{ opacity: 0.5, marginLeft: 8 }}>
                  {message.userSender.userName}
                </Text>
              )}
          </View>

          {/* Message content */}
          <View
            style={[
              styles.messageContentContainer,
              isOwnerMessage && styles.ownerMessageContentContainer,
            ]}>
            <TouchableOpacity activeOpacity={0.6} onLongPress={onSelectedMessageHandle}>
              <View style={styles.messageContentBubble}>

                {!isDeleted && <>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {message.type === MessageType.CallMessage && (
                      <AwesomeIcon
                        name="phone"
                        size={18}
                        color={'#1890ff'}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    {message.type === MessageType.CallEndMessage && (
                      <AwesomeIcon
                        name="phone"
                        size={18}
                        color={'red'}
                        style={{ marginRight: 10 }}
                      />
                    )}
                    {/* text */}
                    {!!message?.content && <Text>{message?.content?.trim()}</Text>}
                  </View>

                  {location && (
                    <View>
                      <Text>Vị trí:</Text>
                      <TouchableOpacity onPress={() => gotoMapLocation(location)}>
                        <Text>
                          {' '}
                          [{location[0].toFixed(2)}, {location[1].toFixed(2)}]
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {message.state == 'upload' && (
                    <MessageItemUpload message={message as MessageUpload} />
                  )}

                  {/* files */}
                  <View style={styles.filesContainer}>
                    {message.files && message.files.length > 0 && (
                      <FileList
                        isHorizontal={true}
                        renderItem={o => {
                          if (o.item.fileType === FileType.Audio)
                            return (
                              <AudioPlayer
                                key={o.item.fileId}
                                id={o.item.fileId}
                                playingId={playingId}
                                durationMiliSeconds={undefined}
                                url={o.item.fileUrl}
                                onPlaying={onPlaying}
                              />
                            );
                          return (
                            <FileView
                              key={o.item.fileId}
                              file={o.item}
                              onView={onViewImage(o.index)}
                              hiddenName={true}
                            />
                          );
                        }}
                        keyExtractorHandler={(item, _) => item.fileId}
                        listFile={message.files}
                      />
                    )}
                  </View>
                </>}

                {/* Deleted message */}
                {isDeleted && <Text style={styles.deletedMessageText}>{'Tin nhắn đã bị xóa'}</Text>}

                <View style={styles.displayDateContainer}>
                  <Text style={styles.displayDateText}>{displayDate}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      )}

      {fileImages.length > 0 && (
        <ImageView
          backgroundColor="white"
          images={images}
          imageIndex={selectedImageIndex}
          visible={imageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
          HeaderComponent={({ imageIndex }) => {
            const title = (images[imageIndex] as any).title;
            return (
              <ImageViewHeader
                title={title}
                onRequestClose={() => setImageViewVisible(false)}
              />
            );
          }}
          FooterComponent={({ imageIndex }) => (
            <ImageViewFooter
              imageIndex={imageIndex}
              imagesCount={images.length}
            />
          )}
        />
      )}
    </React.Fragment>
  );
};

const MessageItemMemo = React.memo(MessageItem);

export default MessageItemMemo;

const styles = StyleSheet.create({
  messageContainer: {
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'flex-start',
    padding: 8,
  },
  ownerMessageContainer: {
    flexDirection: 'row-reverse',
  },
  selectedMessageContainer:{
    backgroundColor: APP_THEME.colors.backdrop
  },
  deletedMessageText:{
    color: APP_THEME.colors.disabled
  },

  messageContentContainer: {
    marginLeft: 8,
    marginRight: 0,
  },
  ownerMessageContentContainer: {
    marginRight: 8,
    marginLeft: 0,
    maxWidth: '80%',
  },
  messageContentBubble: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: APP_THEME.colors.white,
  },

  filesContainer: {},

  displayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  displayDateText: {
    fontSize: 10,
    opacity: 0.5,
  },
});
