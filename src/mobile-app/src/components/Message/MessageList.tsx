import React, {useCallback} from 'react';
import {FlatList, Keyboard, TouchableWithoutFeedback} from 'react-native';

import {useDispatch} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useSelector} from 'react-redux';
import {getMessagesHistory} from '../../stores/conversation/conversation.thunk';

import MessageItem from './MessageItem';
import Loading from '../Loading';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {PageOptions} from '../../types/PageOptions.type';

interface IProps {
  conversation: Conversation;
}

let isStopFetchMore = true;

const MessageList: React.FC<IProps> = ({conversation}) => {
  const conversationState = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const dispatch: AppDispatch = useDispatch();
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };

  const handleOnTopReached = useCallback(() => {
    if (!isStopFetchMore) {
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

      isStopFetchMore = true;
    }
  }, [conversation]);

  const onScrollBeginDragHandler = () => {
    isStopFetchMore = false;
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
        ListFooterComponent={
          conversationState.status === 'loading' ? <Loading /> : <></>
        }
      />
    </TouchableWithoutFeedback>
  );
};

export default MessageList;
