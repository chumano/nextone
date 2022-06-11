import React from 'react';
import {View, StyleSheet} from 'react-native';

import ConversationList from '../../components/Conversation/ConversationList';

const ConversationScreen = () => {
  return (
    <View style={styles.conversationScreenContainer}>
      <ConversationList />
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  conversationScreenContainer: {
    flex: 1,
  },
});
