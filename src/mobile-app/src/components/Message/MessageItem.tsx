import React, {useCallback, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

import UserAvatar from '../User/UserAvatar';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

import {Message} from '../../types/Message/Message.type';
import {useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';
import FileView from '../File/FileView';
import {MessageType} from '../../types/Message/MessageType.type';
import MessageEvent from './MessageEvent';
import {frowNow} from '../../utils/date.utils';
import FileList from '../File/FileList';
import {ImageSource} from 'react-native-vector-icons/Icon';
import {FileType} from '../../types/File/FileType.type';
import ImageView from 'react-native-image-viewing';
import ImageViewHeader from '../ImageView/ImageViewHeader';
import ImageViewFooter from '../ImageView/ImageViewFooter';
import {ConversationType} from '../../types/Conversation/ConversationType.type';
import {useNavigation} from '@react-navigation/native';
import MessageItemUpload, {MessageUpload} from './MessageItemUpload';
import AudioPlayer from '../Player/AudioPlayer';
import {MemberRole} from '../../types/Conversation/ConversationMember.type';

interface IProps {
  message: Message;
  conversationType: ConversationType;
  onPlaying?: (id: string) => void;
  playingId?: string;
  userRole?: MemberRole;
  onSelectMessage?: () => void;
  isSelected?: boolean;
}

const MessageItem: React.FC<IProps> = ({
  message,
  conversationType,
  onPlaying,
  playingId,
  userRole,
  onSelectMessage,
  isSelected,
}) => {
  const authState = useSelector((store: IAppStore) => store.auth);
  const navigation = useNavigation<any>();
  const isOwnerMessage =
    authState.data?.userId === message.userSender.userId ?? false;

  const userAvatar = <UserAvatar size={48} />;

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

  const {isDeleted} = message;

  const onSelectedMessageHandle = useCallback(() => {
    !isDeleted && onSelectMessage && onSelectMessage();
  }, [isDeleted, onSelectMessage]);

  const displayDate = frowNow(message.sentDate);
  const properties = message.properites;
  const location = properties
    ? properties.LOCATION || properties.location
    : undefined;

  const gotoMapLocation = (location: [number, number]) => {
    //window.location.href = `/map?lat=${location[0]}&lon=${location[1]}` ;
    navigation.navigate('MapTab', {
      screen: 'Map',
      params: {position: location},
    });
  };

  return (
    <View style={styles.messageItemContainer}>
      {message.type === MessageType.Event && <MessageEvent message={message} />}

      {message.type !== MessageType.Event && (
        <View
          style={[
            styles.messageContainer,
            isOwnerMessage && styles.ownerMessageItem,
          ]}>
          {/* User Sender */}

          <View
            style={[
              styles.messageItem,
              isOwnerMessage && styles.ownerMessageItem,
            ]}>
            {!isOwnerMessage && userAvatar}
          </View>

          {/* Message content */}
          <View
            style={[
              styles.messageContentContainer,
              isOwnerMessage && styles.ownerMessageContentContainer,
            ]}>
            <TouchableWithoutFeedback onLongPress={onSelectedMessageHandle}>
              <View
                style={[
                  styles.messageContentBubble,
                  isSelected && styles.selectedMessageContainer,
                ]}>
                {conversationType !== ConversationType.Peer2Peer &&
                  !isOwnerMessage && (
                    <Text style={styles.userNameText}>
                      {message.userSender.userName}
                    </Text>
                  )}
                {!isDeleted && (
                  <>
                    <View style={styles.callMessageContainer}>
                      {message.type === MessageType.CallMessage && (
                        <AwesomeIcon
                          name="phone"
                          size={16}
                          color={APP_THEME.colors.green}
                          style={styles.callIconContainer}
                        />
                      )}
                      {message.type === MessageType.CallEndMessage && (
                        <AwesomeIcon
                          name="phone"
                          size={16}
                          color={APP_THEME.colors.red}
                          style={styles.callIconContainer}
                        />
                      )}
                      {/* text */}
                      {!!message?.content && (
                        <Text style={styles.messageText}>
                          {message?.content?.trim()}
                        </Text>
                      )}
                    </View>

                    {location && (
                      <View>
                        <Text>Vị trí:</Text>
                        <TouchableOpacity
                          onPress={() => gotoMapLocation(location)}>
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
                            if (o.item.fileType === FileType.Audio) {
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
                            }
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
                  </>
                )}

                {/* Deleted message */}
                {isDeleted && (
                  <Text style={styles.deletedMessageText}>
                    {'Tin nhắn đã bị xóa'}
                  </Text>
                )}

                <View style={styles.displayDateContainer}>
                  <Text style={styles.displayDateText}>{displayDate}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
          HeaderComponent={({imageIndex}) => {
            const title = (images[imageIndex] as any).title;
            return (
              <ImageViewHeader
                title={title}
                onRequestClose={() => setImageViewVisible(false)}
              />
            );
          }}
          FooterComponent={({imageIndex}) => (
            <ImageViewFooter
              imageIndex={imageIndex}
              imagesCount={images.length}
            />
          )}
        />
      )}
    </View>
  );
};

const MessageItemMemo = React.memo(MessageItem);

export default MessageItemMemo;

const styles = StyleSheet.create({
  messageItemContainer: {
    marginBottom: APP_THEME.spacing.between_component,
    paddingHorizontal: 8,
  },

  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  ownerMessageItem: {
    flexDirection: 'row-reverse',
  },

  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedMessageContainer: {
    backgroundColor: APP_THEME.colors.disabled,
  },

  deletedMessageText: {
    color: APP_THEME.colors.disabled,
  },

  messageContentContainer: {
    marginLeft: 8,
    marginRight: 0,
    maxWidth: '80%',
  },

  ownerMessageContentContainer: {
    marginRight: 8,
    marginLeft: 0,
    maxWidth: '80%',
  },

  messageContentBubble: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: APP_THEME.colors.primary,
  },

  callMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  filesContainer: {},

  callIconContainer: {
    marginRight: 8,
  },

  displayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: APP_THEME.spacing.between_component,
  },

  messageText: {
    fontSize: 12,
    lineHeight: 16,
  },

  displayDateText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '100',
    opacity: 0.7,
  },

  userNameText: {
    fontSize: 10,
    lineHeight: 14,
    marginBottom: APP_THEME.spacing.between_component,
    color: APP_THEME.colors.text,
  },
});
