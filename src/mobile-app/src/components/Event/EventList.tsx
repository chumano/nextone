import React, {useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getEventsByMe} from '../../stores/event/event.thunk';

import Loading from '../Loading';
import EventItem from './EventItem';

interface EventListProps {}
const EventList: React.FC<EventListProps> = () => {
  const dispatch: AppDispatch = useDispatch();
  const eventState = useSelector((state: IAppStore) => state.event);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    //console.log('refreshing............');
    dispatch(getEventsByMe({offset: 0, pageSize: 20}));
    return () => {};
  }, []);

  useEffect(() => {
    //console.log('useEffect getEventsByMe............');
    dispatch(getEventsByMe({offset: 0, pageSize: 20}));
  }, []);

  const loadMoreResults = React.useCallback(async () => {
    //console.log({eventState, length: eventState.data?.length});
    if (eventState.eventsLoading || eventState.allLoaded) return;

    //console.log('loadmoreResult...................', eventState.eventsOffset);
    dispatch(
      getEventsByMe({
        offset: eventState.eventsOffset,
        pageSize: 20,
        loadMore: true,
      }),
    );
  }, [eventState.eventsLoading, eventState.allLoaded, eventState.eventsOffset]);

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!eventState.eventsLoading) return null;
    return <ActivityIndicator />;
  };

  if (eventState.status === 'loading') return <Loading />;

  if (eventState.status === 'success' && eventState.data?.length === 0)
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 12}}>
        <Text>Không có sự kiện</Text>
      </View>
    );

  return (
    <FlatList
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
      data={eventState.data}
      renderItem={itemData => <EventItem eventInfo={itemData.item} />}
      keyExtractor={(item, _) => item.id}
      onEndReachedThreshold={0.4}
      onEndReached={info => {
        loadMoreResults();
      }}
      ListFooterComponent={renderFooter()}
    />
  );
};

export default EventList;
