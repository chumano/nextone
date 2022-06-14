import React from 'react';
import {StyleSheet, View} from 'react-native';
import EventList from '../../components/Event/EventList';

const EventScreen = () => {
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
  },
});
