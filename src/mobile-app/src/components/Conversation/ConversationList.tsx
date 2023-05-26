import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useDispatch, useSelector} from 'react-redux';
import {getListConversation} from '../../stores/conversation/conversation.thunk';

import Loading from '../Loading';
import ConversationItem from './ConversationItem';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {APP_THEME} from '../../constants/app.theme';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const ConversationList = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    data: conversations,
    status,
    allLoaded,
    conversationsLoading,
    conversationsOffset,
  } = useSelector((store: IAppStore) => store.conversation);
  const [refreshing, setRefreshing] = React.useState(false);
  const [initLoading, setInitLoading] = React.useState(true);

  const onRefresh = React.useCallback(() => {
    //setRefreshing(true);
    //console.log('refreshing............');
    dispatch(getListConversation({pageOptions: {offset: 0}}));
    setInitLoading(false);
    return () => {};
  }, []);

  const loadMoreResults = React.useCallback(async () => {
    if (conversationsLoading || allLoaded) {
      return;
    }

    //console.log('loadmoreResult...................', conversationsOffset);
    dispatch(
      getListConversation({
        pageOptions: {offset: conversationsOffset},
        loadMore: true,
      }),
    );
  }, [conversationsLoading, allLoaded, conversationsOffset]);

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!conversationsLoading) {
      return null;
    }
    return <ActivityIndicator />;
  };

  if (status === 'pending') {
    return <Loading />;
  }
  return (
    <View style={styles.conversationContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
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
    </View>
  );
};

const styles = StyleSheet.create({
  conversationContainer: {
    flex: 1,
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
});

export default ConversationList;
