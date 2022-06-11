import React from 'react';
import {FlatList, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {LIST_MESSAGE} from '../../data/Message.data';

import MessageItem from './MessageItem';

const MessageList = () => {
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
      <FlatList
        renderItem={itemData => <MessageItem message={itemData.item} />}
        data={LIST_MESSAGE}
        keyExtractor={item => item.id}
      />
    </TouchableWithoutFeedback>
  );
};

export default MessageList;
