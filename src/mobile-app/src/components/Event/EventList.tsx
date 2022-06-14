import React from 'react';
import {FlatList} from 'react-native';
import {LIST_EVENT} from '../../data/Event.data';
import EventItem from './EventItem';

const EventList = () => {
  return (
    <FlatList
      data={LIST_EVENT}
      renderItem={itemData => <EventItem eventInfo={itemData.item} />}
      keyExtractor={(item, _) => item.id}
    />
  );
};

export default EventList;
