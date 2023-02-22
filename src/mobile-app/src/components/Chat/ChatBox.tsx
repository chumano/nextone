import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {Alert, BackHandler, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useDispatch, useSelector} from 'react-redux';
import {sendMessage} from '../../stores/conversation/conversation.thunk';

import MessageList from '../Message/MessageList';
import ChatInput from './ChatInput';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {IconButton, Text} from 'react-native-paper';
import { conversationApi } from '../../apis/conversation.api';
import { Message } from '../../types/Message/Message.type';
import { conversationActions } from '../../stores/conversation';
import { APP_THEME } from '../../constants/app.theme';
import { MemberRole } from '../../types/Conversation/ConversationMember.type';
import { compareDate, nowDate } from '../../utils/date.utils';

interface IProps {
  conversation: Conversation;
}

const ChatBox: React.FC<IProps> = ({conversation}) => {
  const dispatch: AppDispatch = useDispatch();
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const {members} = conversation;
  const conversationMember = members.find(o => o.userMember.userId === userInfo?.userId)
  const userRole = conversationMember?.role;

  const [selectedMessage, setSelectedMessage]= useState<Message>();
  useEffect(()=>{
    setSelectedMessage(undefined)
  },[conversation.id])

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

  const onDeleteMessage = useCallback(async (message:Message)=>{
      const response = await conversationApi.deleteMessage(conversation.id, message.id);
      if(!response.isSuccess){
          Alert.alert("Không thể xóa tin nhắn")
          return;
      }

      setSelectedMessage(undefined)
      dispatch(conversationActions.deleteMessage({
          conversationId: conversation.id, 
          messageId: message.id
      }))
    
  },[conversation])

  const onSelectMessage = useCallback((message: Message)=>{
    //console.log('onSelectMessage', message)
    setSelectedMessage(message);
  },[])

  const onDeleteSelectedMessage = useCallback(()=>{
    if(selectedMessage){
      onDeleteMessage(selectedMessage);
    }
  },[selectedMessage, onDeleteMessage])

  const onClearSelectedMessage = useCallback(()=>{
    setSelectedMessage(undefined)
  },[])
  
  const onMessageSeen = useCallback(async()=>{
    const seenDate = conversationMember?.seenDate;
    const lastMessage =  conversation.messages.length>0 ? conversation.messages[0] : undefined;

    const lastMessageDate = lastMessage?.sentDate || nowDate();
    
    if(!seenDate || compareDate(seenDate, lastMessageDate) === -1){ //seenDate < lastMessageDate
      console.log('updateMemberSeenDate')
      dispatch(conversationActions.updateMemberSeenDate({
          conversationId: conversation.id,
          memberId: userInfo?.userId!,
          seenDate: lastMessageDate
      }))

      await conversationApi.userSeenCoversation(conversation.id)
    }
    
},[conversationMember,userInfo?.userId, conversation.id, conversation.messages])

  let content: ReactElement<any, any> = conversation ? (
    <>
      <MessageList conversation={conversation} 
        userRole={userRole} 
        onSelectMessage={onSelectMessage}
        selectedMessageId={selectedMessage?.id}
        onMessageSeen={onMessageSeen} 
        />

      {!selectedMessage &&
        <ChatInput conversation={conversation} onSendMessage={onSendMessageHandler}/>
      }

      {selectedMessage &&
        <ActionToolBar 
          isOwnerMessage={userInfo?.userId===selectedMessage.userSender.userId}
          userRole={userRole}
          onDeleteMessage={onDeleteSelectedMessage} 
          onClearSelectedMessage={onClearSelectedMessage}/>
      }
     
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

const ActionToolBar : React.FC<{
  isOwnerMessage?: boolean,
  userRole?:MemberRole,
  onDeleteMessage?:()=>void,
  onClearSelectedMessage?:()=>void,
}>= ( {isOwnerMessage, userRole, onDeleteMessage, onClearSelectedMessage})=>{

  const canDeleteMessage = isOwnerMessage || userRole == MemberRole.MANAGER;
  useEffect(() => {
    const backAction = () => {
      //console.log('hardwareBackPress')
      onClearSelectedMessage && onClearSelectedMessage();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [onClearSelectedMessage]);

  return <View style={styles.actionToolBarContainer}>
      <IconButton
          onPress={onClearSelectedMessage}
          style={styles.button}
          icon="close"
          size={24}
      />
      <View style={{flexGrow:1}}></View>
      <IconButton
          disabled={!canDeleteMessage}
          onPress={onDeleteMessage}
          style={styles.button}
          color='red'
          icon="delete"
          size={24}
      />
  </View>
}

const styles = StyleSheet.create({
  chatBoxContainer: {
    flex: 1,
  },
  actionToolBarContainer:{
    flexDirection: 'row',
    backgroundColor: APP_THEME.colors.white,
    paddingTop:10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    padding: 4,
    margin: 0,
  },
});
