import React, {ReactElement, useCallback} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import {AppDispatch} from '../../stores/app.store';
import {useDispatch} from 'react-redux';
import {sendMessage} from '../../stores/conversation/conversation.thunk';

import MessageList from '../Message/MessageList';
import ChatInput from './ChatInput';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {Text} from 'react-native-paper';

interface IProps {
  conversation: Conversation | undefined;
}

const ChatBox: React.FC<IProps> = ({conversation}) => {
  const dispatch: AppDispatch = useDispatch();
  const onSendMessageHandler = useCallback(
    (text: string) => {
      if (!conversation) return;
      dispatch(
        sendMessage({
          conversationId: conversation.id,
          content: text,
        }),
      );
    },
    [dispatch, conversation],
  );

  let content: ReactElement<any, any> = conversation ? (
    <>
      <MessageList conversation={conversation} />
      <ChatInput conversation={conversation} onSendMessage={onSendMessageHandler} />
    </>
  ) : (
    <View>
      <Text>No Conversation Found!</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.chatBoxContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 96}>
      {content}
    </KeyboardAvoidingView>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  chatBoxContainer: {
    flex: 1,
  },
});
