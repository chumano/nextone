import React, { useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { conversationApi } from '../../apis';

import ConversationList from '../../components/Conversation/ConversationList';
import { IAppStore } from '../../stores/app.store';
import { conversationActions } from '../../stores/conversation';

const ConversationScreen = () => {
  const dispatch = useDispatch();
  const {notLoadedConversationId} = useSelector(
    (store: IAppStore) => store.conversation,
  );
  useEffect(() => {
    if (!notLoadedConversationId) return;
    const fetchConversation = async () => {
        const response = await conversationApi.getConversation(notLoadedConversationId);
        if (response.isSuccess) {
            const conversation = response.data;
            dispatch(conversationActions.addConversation(conversation));
        }
    }
    fetchConversation();
  }, [dispatch, notLoadedConversationId])
  
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
