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
import EventFileItem from '../../components/Event/EventFile';

import {EventInfo} from '../../types/Event/EventInfo.type';

const EventDetailScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventDetailRouteProp>();
  const [eventInfo, setEventInfo] = useState<EventInfo>();

  useLayoutEffect(() => {
    const {eventInfo} = route.params;
    navigation.setOptions({
      title: `EventDetail: ${eventInfo.eventType.name}`,
    });

    setEventInfo(eventInfo);
  }, [navigation, route]);

  if (!eventInfo) return <></>;

  return (
    <View style={styles.eventDetailContainer}>
      <View style={styles.eventInfoContainer}>
        <Avatar.Icon size={64} icon="bell-ring" />
        <View style={styles.eventDescriptionContainer}>
          <Text>{eventInfo.eventType.name}</Text>
          <Text>Occurred Date: {eventInfo.occurDate}</Text>
        </View>
      </View>
      <View style={styles.eventContentContainer}>
        <Text style={styles.eventContentText}>
          Content: {eventInfo.content}
        </Text>
      </View>
      <View style={styles.eventFileListContainer}>
        <FileList
          isHorizontal={true}
          renderItem={itemData => (
            <EventFileItem eventImageUrl={itemData.item.fileUrl} />
          )}
          keyExtractorHandler={(item, _) => item.fileName}
          listFile={LIST_EVENT_FILE}
        />
      </View>
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
    marginTop: 16,
  },
  eventContentText: {
    lineHeight: 20,
    textAlign: 'justify',
  },
});
