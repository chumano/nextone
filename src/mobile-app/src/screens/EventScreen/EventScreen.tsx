import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import EventList from '../../components/Event/EventList';
import {EventsRouteProp, EventStackProps} from '../../navigation/EventStack';
import {AppDispatch} from '../../stores/app.store';
import {getEventsByMe} from '../../stores/event';
import {APP_THEME} from '../../constants/app.theme';

const EventScreen = () => {
  const navigation = useNavigation<EventStackProps>();
  const route = useRoute<EventsRouteProp>();
  const [reload, setReload] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  useLayoutEffect(() => {
    //console.log('EventScreen',{params: route?.params})
    if (route.params) {
      const {reload} = route.params;
      if (reload) {
        dispatch(getEventsByMe({offset: 0, pageSize: 20}));
      }
    }
  }, [navigation, route]);

  return (
    <View style={styles.eventScreenContainer}>
      <EventList />
    </View>
  );
};

export default EventScreen;

const styles = StyleSheet.create({
  eventScreenContainer: {
    flex: 1,
    paddingVertical: APP_THEME.spacing.padding,
  },
});
