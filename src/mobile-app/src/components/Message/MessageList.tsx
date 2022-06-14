import React, { useCallback } from 'react';
import {  FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { useDispatch } from 'react-redux';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import { useSelector } from 'react-redux';
import { getMessagesHistory } from '../../stores/conversation/conversation.thunk';

import MessageItem from './MessageItem';
import Loading from '../Loading';

import { Conversation } from '../../types/Conversation/Conversation.type';
import { PageOptions } from '../../types/PageOptions.type';
import { ActivityIndicator } from 'react-native-paper';

interface IProps {
  conversation: Conversation;
}


const MessageList: React.FC<IProps> = ({ conversation }) => {
  const conversationState = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const [loadingMore, setLoadingMore] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };

  const handleOnTopReached = useCallback(() => {
    console.log('[MessageList] loadMore.....')
    if (loadingMore || conversationState.allLoaded) {
      return;
    }
    setLoadingMore(true);
    const oldestMessage = [...conversation.messages].pop();

    if (!oldestMessage) return;

    const pageOptions = new PageOptions(0, 20);

    dispatch(
      getMessagesHistory({
        conversationId: conversation.id,
        beforeDate: oldestMessage.sentDate,
        ...pageOptions,
      }),
    );

    setLoadingMore(false);

  }, [conversation, conversationState]);

  const onScrollBeginDragHandler = () => {
    //setLoadingMore(false);
  };

  const renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
     if (conversationState.status != 'loading') return null;
     return (
       <ActivityIndicator />
     );
   };
   
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
      <FlatList
        inverted={true}
        renderItem={itemData => <MessageItem message={itemData.item} />}
        data={conversation.messages}
        keyExtractor={item => item.id}

        onEndReached={handleOnTopReached}
        onEndReachedThreshold={0.1}

        onScrollBeginDrag={onScrollBeginDragHandler}
        ListFooterComponent={renderFooter()}
      />
    </TouchableWithoutFeedback>
  );
};

export default MessageList;
