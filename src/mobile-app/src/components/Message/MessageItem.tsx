import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
import ImageView from "react-native-image-viewing";
import ImageViewHeader from '../ImageView/ImageViewHeader';
import ImageViewFooter from '../ImageView/ImageViewFooter';
import { ConversationType } from '../../types/Conversation/ConversationType.type';
import { useNavigation } from '@react-navigation/native';
import { MapScreenProp } from '../../navigation/MapStack';
import MessageItemUpload, { MessageUpload } from './MessageItemUpload';
import AudioPlayer from '../Player/AudioPlayer';

interface IProps {
  message: Message;
  conversationType: ConversationType,
  onPlaying?: (id: string)=>void,
  playingId?: string
}

const MessageItem: React.FC<IProps> = ({ message, conversationType, onPlaying, playingId }) => {
  const authState = useSelector((store: IAppStore) => store.auth);
  const navigation = useNavigation<any>();
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
  const properties = message.properites;
  const gotoMapLocation = (location:[number, number])=>{
      //window.location.href = `/map?lat=${location[0]}&lon=${location[1]}` ;
      navigation.navigate('MapTab', {
        screen: 'Map',
        params: {position :location }
      });
  }

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
              <View style={{display:'flex', flexDirection:'row'}}>
                {message.type === MessageType.CallMessage &&  <AwesomeIcon name="phone" size={18} color={'#1890ff'} style={{marginRight:10}}/> }
                {message.type === MessageType.CallEndMessage && <AwesomeIcon name="phone" size={18} color={'red'} style={{marginRight:10}}/> }
                {/* text */}
                {!!message?.content &&
                  <Text>{message?.content?.trim()}</Text>
                }
              </View>

              {properties && properties['LOCATION'] &&
                  <View>
                      <Text>Vị trí:</Text>
                      <TouchableOpacity onPress={()=>gotoMapLocation(properties['LOCATION']!)}>
                          <Text> [{properties['LOCATION']![0].toFixed(2)}, {properties['LOCATION']![1].toFixed(2)}]</Text>
                      </TouchableOpacity>
                  </View>
              }
              
              {message.state == 'upload' &&
                  <MessageItemUpload message={message as MessageUpload} />
              }
                    
              {/* files */}
              <View style={styles.filesContainer}>
                {message.files && message.files.length > 0 &&
                  <FileList
                    isHorizontal={true}
                    renderItem={o => {
                      if(o.item.fileType === FileType.Audio) 
                        return <AudioPlayer key={o.item.fileId} id={o.item.fileId}  playingId={playingId}
                          durationMiliSeconds={undefined} 
                          url={o.item.fileUrl} onPlaying={onPlaying}/>
                      return <FileView  key={o.item.fileId} file={o.item} onView={onViewImage(o.index)} />
                    }}
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
