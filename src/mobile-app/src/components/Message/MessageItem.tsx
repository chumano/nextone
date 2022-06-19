import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { APP_THEME } from '../../constants/app.theme';

import UserAvatar from '../User/UserAvatar';

import { Message } from '../../types/Message/Message.type';
import { useSelector } from 'react-redux';
import { IAppStore } from '../../stores/app.store';
import FileView from '../File/FileView';
import { MessageType } from '../../types/Message/MessageType.type';
import MessageEvent from './MessageEvent';
import { frowNow } from '../../utils/date.utils';
import FileList from '../File/FileList';
import { ImageSource } from 'react-native-vector-icons/Icon';
import { FileType } from '../../types/File/FileType.type';
import ImageView from "react-native-image-viewing";
import ImageViewHeader from '../ImageView/ImageViewHeader';
import ImageViewFooter from '../ImageView/ImageViewFooter';
import { ConversationType } from '../../types/Conversation/ConversationType.type';

interface IProps {
  message: Message;
  conversationType: ConversationType
}

const MessageItem: React.FC<IProps> = ({ message, conversationType }) => {
  const authState = useSelector((store: IAppStore) => store.auth);
  const isOwnerMessage =
    authState.data?.userId === message.userSender.userId ?? false;

  const userAvatar =
    message.userSender.userAvatarUrl !== '' ? (
      <UserAvatar imageUri={message.userSender.userAvatarUrl} size={24} />
    ) : (
      <Avatar.Icon icon="account" size={24} />
    );

  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [images, setImages] = useState<ImageSource[]>([])

  const fileImages = useMemo(() => {
    return message.files?.filter(o => o.fileType === FileType.Image) || [];
  }, [message.files]);

  const onViewImage = useCallback((index: number) => {
    const images = fileImages;
    return () => {
      const imageSoruces: ImageSource[] = images.map(o => {
        return {
          title: o.fileName,
          uri: o.fileUrl
        }
      })
      setImages(imageSoruces);
      setSelectedImageIndex(index);
      setImageViewVisible(true);
    }
  }, [fileImages])

  const displayDate = frowNow(message.sentDate);
  return (
    <React.Fragment>
      {message.type == MessageType.Event &&
        <View >
          <MessageEvent message={message} />
        </View>
      }
      {message.type !== MessageType.Event &&
        <View
          style={[
            styles.messageContainer,
            isOwnerMessage && styles.ownerMessageContainer,
          ]}>
          {userAvatar}
          <View
            style={[
              styles.messageContentContainer,
              isOwnerMessage && styles.ownerMessageContentContainer,
            ]}>
            {conversationType !== ConversationType.Peer2Peer && !isOwnerMessage &&
              <Text style={{opacity:0.5, marginBottom:5}}>{message.userSender.userName}</Text>
            }
           
            <View  style={styles.messageContentBubble}>
              {/* text */}
              {!!message?.content &&
                <Text>{message?.content?.trim()}</Text>
              }

              {/* files */}
              <View style={styles.filesContainer}>
                {message.files && message.files.length > 0 &&
                  // <View >
                  //   {message.files.map(o =>
                  //     <FileView key={o.fileId} file={o} />
                  //   )}
                  // </View>
                  <FileList
                    isHorizontal={true}
                    renderItem={o => (
                      <FileView file={o.item} onView={onViewImage(o.index)} />
                    )}
                    keyExtractorHandler={(item, _) => item.fileId}
                    listFile={message.files}
                  />
                }
              </View>


              <View style={styles.displayDateContainer} >
                <Text style={styles.displayDateText} >{displayDate}</Text>
              </View>
            </View>

          </View>

        </View>
      }

      {fileImages.length > 0 &&
        <ImageView
          backgroundColor='white'
          images={images}
          imageIndex={selectedImageIndex}
          visible={imageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
          HeaderComponent={({ imageIndex }) => {
            const title = (images[imageIndex] as any).title;
            return (
              <ImageViewHeader title={title} onRequestClose={() => setImageViewVisible(false)} />
            );
          }
          }
          FooterComponent={({ imageIndex }) => (
            <ImageViewFooter imageIndex={imageIndex} imagesCount={images.length} />
          )}
        />
      }
    </React.Fragment >

  );
};

const MessageItemMemo = React.memo(MessageItem);

export default MessageItemMemo;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  ownerMessageContainer: {
    flexDirection: 'row-reverse',
  },

  messageContentContainer: {
    marginLeft: 8,
    marginRight: 0
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

  filesContainer: {

  },

  displayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  displayDateText: {
    fontSize: 10,
    opacity: 0.5
  }

});
