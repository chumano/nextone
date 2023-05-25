import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, RadioButton, Text} from 'react-native-paper';

import {eventApi} from '../../apis/event.api';
import {APP_THEME} from '../../constants/app.theme';
import {EventStackProps} from '../../navigation/EventStack';
import {EventType} from '../../types/Event/EventType.type';

const EventTypePickScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventCodeType, setEventCodeType] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await eventApi.getEventTypesForMe();
      if (!response.isSuccess) {
        return;
      }
      const eventTypes = response.data;
      setEventTypes(eventTypes);
      if (eventTypes.length > 0) {
        setEventCodeType(eventTypes[0].code);
      }
    };

    fetchData();
  }, [setEventCodeType]);

  const onNext = useCallback(() => {
    const eventType = eventTypes.find(o => o.code === eventCodeType);
    navigation.navigate('SendEventScreen', {
      eventType: eventType,
    });
  }, [navigation, eventCodeType, eventTypes]);

  return (
    <View style={styles.eventTypePickScreenContainer}>
      <View style={styles.eventTypePickForm}>
        <View style={styles.eventTypeContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Loại sự kiện: </Text>
          </View>
          <View style={styles.radioButtonGroupContainer}>
            {eventTypes.length > 0 && (
              <RadioButton.Group
                value={eventCodeType!}
                onValueChange={value => setEventCodeType(value)}>
                {eventTypes.map(type => (
                  <RadioButton.Item
                    key={type.code}
                    label={type.name}
                    value={type.code}
                    style={[styles.radioItem, {marginLeft: 16}]}
                    labelStyle={{marginLeft: -16}}
                  />
                ))}
              </RadioButton.Group>
            )}
            {eventTypes.length === 0 && <Text>Chưa có loại sự kiện</Text>}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            style={styles.button}
            disabled={!eventCodeType}
            mode="contained"
            onPress={onNext}>
            Tiếp tục
          </Button>
        </View>
      </View>
    </View>
  );
};

export default EventTypePickScreen;

const styles = StyleSheet.create({
  eventTypePickScreenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  eventTypePickForm: {
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    marginBottom: 8,
  },
  eventTypeContainer: {
    marginVertical: APP_THEME.spacing.between_component,
  },
  labelText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },

  radioButtonGroupContainer: {
    backgroundColor: APP_THEME.colors.background,
  },

  radioItem: {
    borderBottomColor: `${APP_THEME.colors.black}3a`,
    borderBottomWidth: 1,
  },

  buttonContainer: {
    marginTop: 2 * APP_THEME.spacing.between_component,
  },

  button: {
    backgroundColor: APP_THEME.colors.accent,
  },
});
