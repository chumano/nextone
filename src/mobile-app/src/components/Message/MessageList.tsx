import React from 'react';
import {FlatList, Keyboard, TouchableWithoutFeedback} from 'react-native';

import MessageItem from './MessageItem';

import {Conversation} from '../../types/Conversation/Conversation.type';

interface IProps {
  conversation: Conversation;
}

const MessageList: React.FC<IProps> = ({conversation}) => {
  const dismissKeyboardHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboardHandler}>
      <FlatList
        inverted
        renderItem={itemData => <MessageItem message={itemData.item} />}
        data={conversation.messages}
        keyExtractor={item => item.id}
      />
    </TouchableWithoutFeedback>
  );
};

export default MessageList;
