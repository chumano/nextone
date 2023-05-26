import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';
import {EventStackProps} from '../../navigation/EventStack';
import {EventInfo} from '../../types/Event/EventInfo.type';
import {frowNow} from '../../utils/date.utils';

interface IProps {
  eventInfo: EventInfo;
}

const EventItem: React.FC<IProps> = ({eventInfo}) => {
  const navigation = useNavigation<EventStackProps>();
  const loadEventDetailHandler = () => {
    navigation.navigate('EventDetailScreen', {
      eventInfo,
    });
  };

  const displayDate = frowNow(eventInfo.createdDate);
  return (
    <TouchableOpacity
      onPress={loadEventDetailHandler}
      style={styles.eventItemContainer}>
      <View style={styles.eventItem}>
        <Avatar.Icon
          size={36}
          icon="bell-ring"
          color={APP_THEME.colors.yellow}
        />

        <View style={styles.eventInformationContainer}>
          <View style={styles.conversationContent}>
            <Text style={styles.eventTypeNameText}>
              {eventInfo.eventType.name}
            </Text>
            <View style={styles.eventContentContainer}>
              <Text numberOfLines={2} style={styles.eventContentText}>
                {eventInfo.content}
              </Text>
            </View>
          </View>
          <View style={styles.eventOccurredDateContainer}>
            <Text style={styles.eventOccurredDateText}>{displayDate}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  eventItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: APP_THEME.spacing.between_component,

    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: APP_THEME.rounded,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventInformationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: APP_THEME.spacing.between_component,
  },
  conversationContent: {
    flexDirection: 'column',
  },
  eventOccurredDateContainer: {
    marginLeft: 'auto',
  },

  eventContentContainer: {
    marginTop: 4,
    maxWidth: '100%',
  },
  eventTypeNameText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'normal',
    textTransform: 'uppercase',
  },
  eventContentText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
    opacity: 0.7,
  },
  eventOccurredDateText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '100',
    opacity: 0.7,
  },
});
