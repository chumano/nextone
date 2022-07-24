import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import {View, StyleSheet} from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { conversationApi } from '../../apis';

import ConversationList from '../../components/Conversation/ConversationList';
import { AppDispatch, IAppStore } from '../../stores/app.store';
import { conversationActions } from '../../stores/conversation';
import {getListConversation} from '../../stores/conversation/conversation.thunk';

const ConversationScreen = () => {
  const dispatch: AppDispatch = useDispatch();
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
  
  useEffect(() => {
    dispatch(getListConversation({pageOptions: {offset: 0}}));
  }, [dispatch]);
  
  useFocusEffect(useCallback(() => {
    console.log("ConversationScreen is focused") 
    //dispatch(getListConversation({pageOptions: {offset: 0}}));
    return () => {
      console.log("ConversationScreen is outfocused") 
    };
  }, []));

  
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
