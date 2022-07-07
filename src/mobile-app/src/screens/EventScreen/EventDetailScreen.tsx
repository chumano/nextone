import React, {useLayoutEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

import {
  EventDetailRouteProp,
  EventStackProps,
} from '../../navigation/EventStack';

import FileList from '../../components/File/FileList';

import {LIST_EVENT_FILE} from '../../data/File.data';

import {EventInfo} from '../../types/Event/EventInfo.type';
import FileView from '../../components/File/FileView';

const EventDetailScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventDetailRouteProp>();
  const [eventInfo, setEventInfo] = useState<EventInfo>();

  useLayoutEffect(() => {
    const {eventInfo} = route.params;
    navigation.setOptions({
      title: `Sự kiện : ${eventInfo.eventType.name}`,
    });

    console.log('EventDetailScreen',{eventInfo})
    setEventInfo(eventInfo);
  }, [navigation, route]);

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
              <FileView file={itemData.item} hiddenName={true}/>
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
