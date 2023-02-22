import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { useDispatch } from 'react-redux';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import { useSelector } from 'react-redux';
import { getMessagesHistory } from '../../stores/conversation/conversation.thunk';

import MessageItem from './MessageItem';
import Loading from '../Loading';

import { Conversation } from '../../types/Conversation/Conversation.type';
import { PageOptions } from '../../types/PageOptions.type';
import { ActivityIndicator, FAB } from 'react-native-paper';
import { MessageType } from '../../types/Message/MessageType.type';
import { conversationApi } from '../../apis';
import { Message } from '../../types/Message/Message.type';
import { conversationActions } from '../../stores/conversation';
import { MemberRole } from '../../types/Conversation/ConversationMember.type';

interface IProps {
  conversation: Conversation;
  userRole?: MemberRole,
  onSelectMessage?: (message: Message) => void,
  selectedMessageId?: string,
  onMessageSeen?: () => void,
}


const MessageList: React.FC<IProps> = ({ conversation, userRole, onSelectMessage, selectedMessageId, onMessageSeen }) => {
  const flatListRef = React.useRef<any>()

  const { messagesAllLoaded, messagesLoading } = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const [isBottom, setIsBottom] = useState(true);
  const [messageSeen, setMessageSeen] = useState(false)

  const dispatch: AppDispatch = useDispatch();
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };

  const handleOnTopReached = useCallback(() => {
    //console.log('[MessageList] loadMore.....', messagesLoading, messagesAllLoaded)
    if (messagesLoading || messagesAllLoaded) {
      return;
    }
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

  }, [conversation, messagesAllLoaded]);

  useEffect(() => {
    setIsBottom(true)
  }, [])

  useEffect(() => {
    if (messageSeen) {
      onMessageSeen && onMessageSeen();
      setMessageSeen(false);
    }
  }, [messageSeen, onMessageSeen])

  useEffect(() => {
    if (isBottom) {
      setMessageSeen(true)
    }
  }, [isBottom])

  const onClick = useCallback(() => {
    if (isBottom) {
      setMessageSeen(true);
    }
  }, [isBottom])
  
  const scrollToBottom = () => {
    flatListRef.current.scrollToOffset({ animating: false, offset: 0 });
  }
  const onScrollBeginDragHandler = () => {
    //setLoadingMore(false);
  };

  const renderFooter = () => {
    if (!messagesLoading) return null;
    return (
      <ActivityIndicator />
    );
  };

  const [playingId, setPlayingId] = useState<string>();
  const onItemPlay = useCallback((id: string) => {
    setPlayingId(id);
  }, [])

  const onSelectMessageHandle = useCallback((message: Message) => {
    return () => {
      onSelectMessage && onSelectMessage(message);
    }
  }, [onSelectMessage])

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
        <FlatList
          ref={flatListRef}
          inverted={true}
          renderItem={itemData =>
            <MessageItem message={itemData.item}
              conversationType={conversation.type}
              userRole={userRole}
              onPlaying={onItemPlay}
              playingId={itemData.item.type === MessageType.AudioFile ? playingId : undefined}
              onSelectMessage={onSelectMessageHandle(itemData.item)}
              isSelected={selectedMessageId === itemData.item.id}
            />
          }
          data={conversation.messages}
          keyExtractor={item => item.id}

          onEndReached={handleOnTopReached}
          onEndReachedThreshold={0.4}

          onScroll={(evt) => {
            if (evt.nativeEvent.contentOffset.y > 20) {
              setIsBottom(false)
            } else {
              setIsBottom(true)
            }
          }}

          onScrollBeginDrag={onScrollBeginDragHandler}
          ListFooterComponent={renderFooter()}
          onTouchEnd={onClick}
        />
      </TouchableWithoutFeedback>

      {!isBottom &&
        <FAB
          style={styles.floatScrollBottomBtn}
          small
          icon="arrow-down"
          onPress={scrollToBottom}
        />
      }
    </React.Fragment>

  );
};

export default MessageList;

const styles = StyleSheet.create({
  floatScrollBottomBtn: {
    position: 'absolute',
    bottom: 100,
    right: 8,
  },
});