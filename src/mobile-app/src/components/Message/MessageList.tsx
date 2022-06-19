import React, { useCallback, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { useDispatch } from 'react-redux';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import { useSelector } from 'react-redux';
import { getMessagesHistory } from '../../stores/conversation/conversation.thunk';

import MessageItem from './MessageItem';
import Loading from '../Loading';

import { Conversation } from '../../types/Conversation/Conversation.type';
import { PageOptions } from '../../types/PageOptions.type';
import { ActivityIndicator, FAB } from 'react-native-paper';

interface IProps {
  conversation: Conversation;
}


const MessageList: React.FC<IProps> = ({ conversation }) => {
  const flatListRef = React.useRef<any>()

  const { messagesAllLoaded, messagesLoading } = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const [scrollBtnVisivle, setScrollButnVisible ] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };

  const handleOnTopReached = useCallback(() => {
    console.log('[MessageList] loadMore.....', messagesLoading, messagesAllLoaded)
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

  const scrollToBottom = ()=>{
    flatListRef.current.scrollToOffset({animating: false, offset: 0});
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

  return (
    <React.Fragment>
      <TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
        <FlatList
          ref={flatListRef}
          inverted={true}
          renderItem={itemData => <MessageItem message={itemData.item} conversationType={conversation.type}/>}
          data={conversation.messages}
          keyExtractor={item => item.id}

          onEndReached={handleOnTopReached}
          onEndReachedThreshold={0.4}

          onScroll={(evt)=>{
            if(evt.nativeEvent.contentOffset.y > 20){
              setScrollButnVisible(true)
            }else{
              setScrollButnVisible(false)
            }
          }}

          onScrollBeginDrag={onScrollBeginDragHandler}
          ListFooterComponent={renderFooter()}
        />
      </TouchableWithoutFeedback>
      
      {scrollBtnVisivle &&
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