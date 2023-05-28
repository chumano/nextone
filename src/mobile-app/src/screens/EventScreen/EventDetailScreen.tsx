import React, {useCallback, useLayoutEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';

import {
  EventDetailRouteProp,
  EventStackProps,
} from '../../navigation/EventStack';

import FileList from '../../components/File/FileList';
import {EventInfo} from '../../types/Event/EventInfo.type';
import FileView from '../../components/File/FileView';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {groupFileByType} from '../../utils/file.utils';
import ImageViewHeader from '../../components/ImageView/ImageViewHeader';
import ImageViewFooter from '../../components/ImageView/ImageViewFooter';
import {APP_THEME} from '../../constants/app.theme';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const EventDetailScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventDetailRouteProp>();
  const [eventInfo, setEventInfo] = useState<EventInfo>();

  useLayoutEffect(() => {
    const {eventInfo} = route.params;
    navigation.setOptions({
      header: props => {
        return (
          <Appbar.Header
            style={{
              backgroundColor: APP_THEME.colors.primary,
            }}>
            {props.back && (
              <Appbar.BackAction
                color={APP_THEME.colors.accent}
                onPress={() => {
                  props.navigation.goBack();
                }}
              />
            )}
            <Appbar.Content
              title={`Sự kiện : ${eventInfo.eventType.name}`}
              color={APP_THEME.colors.accent}
              titleStyle={styles.title}
            />
          </Appbar.Header>
        );
      },
    });

    //console.log('EventDetailScreen',{eventInfo})
    setEventInfo(eventInfo);
  }, [navigation, route]);

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

  if (!eventInfo) {
    return <></>;
  }
  return (
    <View style={styles.eventDetailContainer}>
      <View style={styles.eventDetailForm}>
        <View style={styles.eventInfoContainer}>
          <MaterialCommunityIcon
            size={48}
            name="bell-ring"
            color={APP_THEME.colors.yellow}
          />
          <View style={styles.eventDescriptionContainer}>
            <Text style={styles.eventTypeText}>{eventInfo.eventType.name}</Text>
            <Text style={styles.occurDateText}>
              Thời gian: {eventInfo.occurDate}
            </Text>
          </View>
        </View>

        <View style={styles.eventContentContainer}>
          <Text style={styles.eventContentText}>Người gửi: </Text>
          <Text style={styles.valueText}>{eventInfo.userSender.userName}</Text>
        </View>

        <View style={styles.eventContentContainer}>
          <Text style={styles.eventContentText}>Nội dung: </Text>
          <Text style={styles.valueText}>{eventInfo.content}</Text>
        </View>

        {(eventInfo?.files?.length || 0) > 0 && (
          <View style={styles.eventFileListContainer}>
            <Text style={styles.eventContentText}>
              Hình ảnh: ({eventInfo?.files?.length || 0})
            </Text>

            <View style={styles.listContainer}>
              <FileList
                isHorizontal={true}
                renderItem={itemData => (
                  <FileView
                    file={itemData.item}
                    hiddenName={true}
                    onView={onViewImage(itemData.index)}
                  />
                )}
                keyExtractorHandler={(item, _) => item.fileId}
                listFile={eventInfo.files}
              />
            </View>
          </View>
        )}
        {(eventInfo?.files?.length || 0) === 0 && (
          <View style={styles.eventFileListContainer}>
            <Text style={styles.noEventText}>Không có hình ảnh</Text>
          </View>
        )}

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
      </View>
    </View>
  );
};

export default EventDetailScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
  eventDetailContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  eventDetailForm: {
    width: '100%',
    shadowOpacity: 1,
    shadowRadius: APP_THEME.rounded,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    padding: APP_THEME.spacing.padding,
    borderRadius: APP_THEME.rounded,
  },
  eventInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventContentContainer: {
    marginTop: APP_THEME.spacing.between_component,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    marginTop: 2 * APP_THEME.spacing.between_component,
  },
  eventFileListContainer: {
    marginTop: APP_THEME.spacing.between_component,
  },
  eventContentText: {
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.7,
  },
  valueText: {
    fontSize: 16,
    lineHeight: 20,
  },
  eventDescriptionContainer: {
    marginLeft: 10,
  },
  eventTypeText: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  occurDateText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
  },
  noEventText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
  },
});
