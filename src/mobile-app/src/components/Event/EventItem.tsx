import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';
import {EventStackProps} from '../../navigation/EventStack';
import {EventInfo} from '../../types/Event/EventInfo.type';

interface IProps {
  eventInfo: EventInfo;
}

const EventItem: React.FC<IProps> = ({eventInfo}) => {
  const navigation = useNavigation<EventStackProps>();
  const loadEventDetailHandler = () => {
    navigation.navigate('EventDetailScreen');
  };
  return (
    <Pressable
      onPress={loadEventDetailHandler}
      style={({pressed}) => [
        styles.eventItemContainer,
        pressed && styles.eventInfoPressed,
      ]}>
      <View style={styles.eventTypeIconContainer}>
        <Avatar.Icon size={36} icon="folder" />
      </View>
      <View style={styles.eventInformationContainer}>
        <View style={styles.conversationContent}>
          <Text style={styles.eventTypeNameText}>
            {eventInfo.eventType.name}
          </Text>
          <View style={styles.eventContentContainer}>
            <Text numberOfLines={1} style={styles.eventContentText}>
              {eventInfo.content}
            </Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text>Send by: {eventInfo.userSender.userName}</Text>
          </View>
        </View>
        <View style={styles.eventOccurredDateContainer}>
          <Text style={styles.eventOccurredDateText}>12 minutes ago</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  eventItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  eventTypeIconContainer: {},
  eventInformationContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 24,
    marginLeft: 16,
    borderBottomColor: APP_THEME.colors.disabled,
    borderBottomWidth: 0.2,
  },
  userInfoContainer: {},
  conversationContent: {
    flexDirection: 'column',
  },
  eventOccurredDateContainer: {
    marginLeft: 'auto',
  },
  eventInfoPressed: {
    opacity: 0.7,
  },
  eventContentContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  eventTypeNameText: {
    fontSize: 16,
    textTransform: 'uppercase',
  },
  eventContentText: {
    fontSize: 12,
    fontWeight: '400',
  },
  eventOccurredDateText: {
    fontSize: 12,
    fontWeight: '200',
  },
});
