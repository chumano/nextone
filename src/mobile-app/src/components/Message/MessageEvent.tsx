import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';
import {Message} from '../../types/Message/Message.type';
import {frowNow} from '../../utils/date.utils';
import {groupFileByType} from '../../utils/file.utils';
import FileList from '../File/FileList';
import FileView from '../File/FileView';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import ImageViewHeader from '../ImageView/ImageViewHeader';
import ImageViewFooter from '../ImageView/ImageViewFooter';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MessageEventProps {
  message: Message;
}
const MessageEvent: React.FC<MessageEventProps> = ({message}) => {
  const navigation = useNavigation<any>();
  const eventInfo = message.event!;
  const group = useMemo(() => {
    return groupFileByType(eventInfo?.files || []);
  }, [eventInfo]);

  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [images, setImages] = useState<ImageSource[]>([]);

  const onViewImage = useCallback(
    (index: number) => {
      const images = group.image;
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
    [group],
  );

  const onViewEvent = useCallback(() => {
    // navigation.navigate('EventTab', {
    //     screen: 'EventDetailScreen',
    //     params: {
    //         eventInfo: eventInfo
    //     }
    //   });
    navigation.navigate('ChatEventDetailScreen', {
      eventInfo: eventInfo,
    });
  }, [eventInfo]);

  const displayDate = frowNow(message.sentDate);
  return (
    <>
      <View style={styles.messageContainer}>
        <TouchableOpacity style={styles.headerContainer} onPress={onViewEvent}>
          <Text style={styles.headerText}>{eventInfo.eventType.name}</Text>
          <MaterialCommunityIcon
            name={'bell-ring'}
            size={24}
            color={APP_THEME.colors.yellow}
          />
        </TouchableOpacity>

        <View style={styles.senderContainer}>
          <Text style={styles.senderText}>
            {message.userSender.userName} {' - '} {eventInfo.occurDate}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{eventInfo.content}</Text>
        </View>

        {eventInfo.files && eventInfo.files.length > 0 && (
          <View style={styles.mediaContainer}>
            {group.image.length > 0 && (
              <FileList
                isHorizontal={true}
                renderItem={o => (
                  <FileView
                    file={o.item}
                    onView={onViewImage(o.index)}
                    hiddenName={true}
                  />
                )}
                keyExtractorHandler={(item, _) => item.fileId}
                listFile={group.image}
              />
            )}
            {group.other.length > 0 && (
              <FileList
                isHorizontal={true}
                renderItem={o => (
                  <View>
                    <FileView file={o.item} hiddenName={true} />
                    <Text numberOfLines={2} style={styles.fileName}>
                      {o.item.fileName}
                    </Text>
                  </View>
                )}
                keyExtractorHandler={(item, _) => item.fileId}
                listFile={group.other}
              />
            )}
          </View>
        )}

        <View style={styles.displayDateContainer}>
          <Text style={styles.displayDateText}>{displayDate}</Text>
        </View>
      </View>

      <ImageView
        backgroundColor={APP_THEME.colors.primary}
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
    </>
  );
};

export default React.memo(MessageEvent);

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: `${APP_THEME.colors.black}3a`,
    borderRadius: APP_THEME.rounded,
    marginHorizontal: APP_THEME.spacing.padding,
    padding: 12,
    backgroundColor: APP_THEME.colors.background,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  contentContainer: {
    flex: 1,
    marginBottom: APP_THEME.spacing.between_component,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 20,
  },
  senderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2 * APP_THEME.spacing.between_component,
  },
  senderText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    opacity: 0.7,
  },

  mediaContainer: {
    marginBottom: APP_THEME.spacing.between_component,
  },

  fileName: {
    maxWidth: 164,
    flexDirection: 'row',
  },

  displayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  displayDateText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '100',
    opacity: 0.7,
  },
});
