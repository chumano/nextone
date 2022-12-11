import React, {useLayoutEffect, useMemo, useState, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

import {
  EventDetailRouteProp,
  EventStackProps,
} from '../../navigation/EventStack';

import FileList from '../../components/File/FileList';
import {EventInfo} from '../../types/Event/EventInfo.type';
import FileView from '../../components/File/FileView';
import ImageView from "react-native-image-viewing";
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { groupFileByType } from '../../utils/file.utils';
import ImageViewHeader from '../../components/ImageView/ImageViewHeader';
import ImageViewFooter from '../../components/ImageView/ImageViewFooter';

const EventDetailScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventDetailRouteProp>();
  const [eventInfo, setEventInfo] = useState<EventInfo>();

  useLayoutEffect(() => {
    const {eventInfo} = route.params;
    navigation.setOptions({
      title: `Sự kiện : ${eventInfo.eventType.name}`,
    });

    //console.log('EventDetailScreen',{eventInfo})
    setEventInfo(eventInfo);
  }, [navigation, route]);

  const group = useMemo(() => {
    return groupFileByType(eventInfo?.files || []);
  }, [eventInfo])

  const [imageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [images, setImages] = useState<ImageSource[]>([])

  const onViewImage = useCallback((index: number) => {
      const images = group['image'];
      return () => {
          const imageSoruces: ImageSource[] = images.map(o=> {
              return {
                title: 'Hình ảnh',
                  uri: o.fileUrl
              }
          })
          setImages(imageSoruces);
          setSelectedImageIndex(index);
          setImageViewVisible(true);
      }
  }, [group])
  
  if (!eventInfo) return <></>;
  return (
    <View style={styles.eventDetailContainer}>
      <View style={styles.eventInfoContainer}>
        <Avatar.Icon size={64} icon="bell-ring" />
        <View style={styles.eventDescriptionContainer}>
          <Text>{eventInfo.eventType.name}</Text>
          <Text>Thời gian: {eventInfo.occurDate}</Text>
        </View>
      </View>
      <View style={styles.eventContentContainer}>
        <Text style={styles.eventContentText}>
          Người gửi: {eventInfo.userSender.userName}
        </Text>
      </View>
      <View style={styles.eventContentContainer}>
        <Text style={styles.eventContentText}>
          Nội dung: {eventInfo.content}
        </Text>
      </View>
      { (eventInfo?.files?.length||0)> 0 &&
        <View style={styles.eventFileListContainer}>
          <View >
            <Text >
              Hình ảnh: ({eventInfo?.files?.length||0})
            </Text>
          </View>

          <FileList
            isHorizontal={true}
            renderItem={itemData => (
              <FileView file={itemData.item} hiddenName={true}  
                onView={onViewImage(itemData.index)}
                />
            )}
            keyExtractorHandler={(item, _) => item.fileId}
            listFile={eventInfo.files}
          />

        </View>
      }
      { (eventInfo?.files?.length||0) === 0 &&
        <View style={styles.eventFileListContainer} >
          <Text >
            Không có hình ảnh
          </Text>
        </View>
      }

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
      
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  eventDetailContainer: {
    padding: 16,
  },
  eventInfoContainer: {
    flexDirection: 'row',
  },
  eventDescriptionContainer: {
    marginLeft: 16,
  },
  eventContentContainer: {
    marginTop: 8,
  },

  eventFileListContainer: {
    marginTop: 16
  },
  eventContentText: {
    lineHeight: 20,
    textAlign: 'justify',
  },
});
