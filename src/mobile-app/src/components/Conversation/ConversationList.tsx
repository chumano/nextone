import React, { useEffect } from 'react';
import {FlatList, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import { useDispatch } from 'react-redux';
import { getListConversation } from '../../stores/conversation/conversation.thunk';

import Loading from '../Loading';
import ConversationItem from './ConversationItem';

import { Conversation } from '../../types/Conversation/Conversation.type';
import { useSelector } from 'react-redux';

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
  indicator:{
  }
});

const wait = (timeout:number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const ConversationList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, status } = useSelector((store: IAppStore) => store.conversation);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [allLoaded, setAllLoaded] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log('refreshing............')
    dispatch(getListConversation());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    dispatch(getListConversation());
  }, [dispatch]);

  const loadMoreResults =React.useCallback( async () => {
    // if already loading more, or all loaded, return
    if (loadingMore || allLoaded)
       return
    // set loading more (also updates footer text)
    setLoadingMore(true);
    console.log('loadmoreResult...................')
    // get next results
    await wait(2000)
    // load more complete, set loading more to false
    setLoadingMore(false);
 },[loadingMore, allLoaded])

 const renderFooter = () => {
  //it will show indicator at the bottom of the list when data is loading otherwise it returns null
   if (!loadingMore) return null;
   return (
     <ActivityIndicator  style={styles.indicator}/>
   );
 };

 if (status === 'loading') return <Loading />;

  return (
      <FlatList
        onRefresh={() => onRefresh()}
        refreshing={refreshing}

        keyExtractor={(item: Conversation, _) => item.id}
        data={data}
        renderItem={props => <ConversationItem conversation={props.item} />}
        
        onEndReachedThreshold={0.01}
        onEndReached={info => {
          loadMoreResults();
        }}
        ListFooterComponent={renderFooter()}
      />
  );
};

export default ConversationList;
