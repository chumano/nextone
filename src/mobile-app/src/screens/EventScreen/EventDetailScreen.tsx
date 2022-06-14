import React, {useLayoutEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

import {EventStackProps} from '../../navigation/EventStack';
import FileList from '../../components/File/FileList';

import {LIST_EVENT_FILE} from '../../data/File.data';
import EventFileItem from '../../components/Event/EventFile';

const EventDetailScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: `EventDetail: Fire`,
    });
  }, [navigation]);

  return (
    <View style={styles.eventDetailContainer}>
      <View style={styles.eventInfoContainer}>
        <Avatar.Icon size={64} icon="shield-account" />
        <View style={styles.eventDescriptionContainer}>
          <Text>[Security] - Fire</Text>
          <Text>Channel: 01</Text>
          <Text>UserSender: Julian Wan</Text>
          <Text>Occurred Date: 2022-12-06 12:12</Text>
        </View>
      </View>
      <View style={styles.eventContentContainer}>
        <Text style={styles.eventContentText}>
          Content: Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishing software like
          Aldus PageMaker including versions of Lorem Ipsum.
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

// export interface EventInfo {
//   id: string;
//   content: string;
//   eventTypeCode: string;
//   eventType: EventType;
//   occurDate: string;
//   address: string;
//   lat: number;
//   lon: number;
//   channelId: string;
//   userSenderId: string;
//   userSender: UserStatus;
//   files: EventFile[];
// }

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
  eventFileListContainer: {},
  eventContentText: {
    lineHeight: 20,
    textAlign: 'justify',
  },
});
