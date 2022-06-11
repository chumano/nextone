import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';

import MessageList from '../Message/MessageList';
import ChatInput from './ChatInput';

const ChatBox = () => {
  return (
    <KeyboardAvoidingView
      style={styles.chatBoxContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 128}>
      <MessageList />
      <ChatInput />
    </KeyboardAvoidingView>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  chatBoxContainer: {
    flex: 1,
  },
});
