import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getEventsByMe} from '../../stores/event/event.thunk';

import Loading from '../Loading';
import EventItem from './EventItem';

const EventList = () => {
  const dispatch: AppDispatch = useDispatch();
  const eventState = useSelector((state: IAppStore) => state.event);

  useEffect(() => {
    dispatch(
      getEventsByMe({
        offset: 0,
        pageSize: 20,
      }),
    );
  }, []);

  if (eventState.status === 'loading') return <Loading />;

  return (
    <FlatList
      data={eventState.data}
      renderItem={itemData => <EventItem eventInfo={itemData.item} />}
      keyExtractor={(item, _) => item.id}
    />
  );
};

export default EventList;
