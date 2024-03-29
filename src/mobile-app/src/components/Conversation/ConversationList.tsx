import React, {useEffect} from 'react';
import {FlatList, RefreshControl, ScrollView, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useDispatch} from 'react-redux';
import {getListConversation} from '../../stores/conversation/conversation.thunk';

import Loading from '../Loading';
import ConversationItem from './ConversationItem';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {useSelector} from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {},
});

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const ConversationList = () => {
  const dispatch: AppDispatch = useDispatch();
  const {data : conversations, status, allLoaded, 
    conversationsLoading,
    conversationsOffset} = useSelector((store: IAppStore) => store.conversation);
  const [refreshing, setRefreshing] = React.useState(false);
  const [initLoading, setInitLoading] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    //setRefreshing(true);
    //console.log('refreshing............');
    dispatch(getListConversation({pageOptions: {offset: 0}}));
    setInitLoading(false);
    return ()=>{
    }
  }, []);

  const loadMoreResults = React.useCallback(async () => {
    if (conversationsLoading || allLoaded) return;

    //console.log('loadmoreResult...................', conversationsOffset);
    dispatch(getListConversation({pageOptions:{offset: conversationsOffset}, loadMore: true}));
  }, [conversationsLoading, allLoaded, conversationsOffset]);


  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!conversationsLoading) return null;
    return <ActivityIndicator style={styles.indicator} />;
  };

  if (status === 'pending') return <Loading />;
  return (
    <FlatList
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
      keyExtractor={(item: Conversation, _) => item.id}
      data={conversations}
      renderItem={props => <ConversationItem conversation={props.item} />}
      onEndReachedThreshold={0.4}
      onEndReached={info => {
        loadMoreResults();
      }}
      ListFooterComponent={renderFooter()}
    />
  );
};

export default ConversationList;
