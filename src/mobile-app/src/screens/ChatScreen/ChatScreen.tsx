import React, {ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

import {ChatStackProps} from '../../navigation/ChatStack';

import {useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';

import UserAvatar from '../../components/User/UserAvatar';
import ChatBox from '../../components/Chat/ChatBox';
import ConversationAvatar from '../../components/Conversation/ConversationAvatar';

import {ConversationType} from '../../types/Conversation/ConversationType.type';
import {UserStatus} from '../../types/User/UserStatus.type';
import {Conversation} from '../../types/Conversation/Conversation.type';
import Loading from '../../components/Loading';
import { ConversationMember } from '../../types/Conversation/ConversationMember.type';

interface ChatParams {
  conversationId: string;
}

const ChatScreen = ({navigation, route}: ChatStackProps) => {
  const {data: listConversation} = useSelector((store: IAppStore) => store.conversation);
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const [otherUser, setOtherUser] = useState<UserStatus>();
  const [conversationId, setConversationId] = useState<string>();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();

  useLayoutEffect(() => {
    //console.log('ChatScreen....')
    const params = route.params;
    if (!params) return;
    const {conversationId} = params as ChatParams;
    setConversationId(conversationId);
  }, [navigation, route]);

  useEffect(()=>{
    if (!listConversation || !userInfo || !conversationId) return;

    const selectedConversation = listConversation.find(
      c => c.id === conversationId,
    );

    if (!selectedConversation) return;

    setSelectedConversation(selectedConversation);

    let conversationTypeIcon: ReactElement<any, any>;
    let otherUser : UserStatus | undefined = undefined;
    switch (selectedConversation.type) {
      case ConversationType.Peer2Peer: {
        const otherUserMember = selectedConversation.members.filter(
          m => m.userMember.userId !== userInfo.userId,
        )[0];

        otherUser = otherUserMember.userMember;
        
        conversationTypeIcon =
          otherUser.userAvatarUrl !== '' ? (
            <UserAvatar
              imageUri={otherUser.userAvatarUrl}
              size={24}
            />
          ) : (
            <Avatar.Icon icon="account" size={24} />
          );

        
        break;
      }
      case ConversationType.Channel:
      case ConversationType.Private:
      case ConversationType.Group:
        conversationTypeIcon = (
          <ConversationAvatar icon="account-group" size={24} />
        );
        break;
    }
    setOtherUser(otherUser);
    if (!otherUser) return;

    navigation.setOptions({
      title: `${otherUser.userName}`,
      headerTitle: ({children}) => (
        <View style={styles.headerContainer}>
          {conversationTypeIcon}
          <View style={styles.userNameContainer}>
            <Text style={styles.userNameText}>{children}</Text>
          </View>
        </View>
      ),
    });
  },[listConversation,conversationId, userInfo]);
  
  return (
    <React.Fragment>
      { selectedConversation &&
        <ChatBox conversation={selectedConversation} />
      }
      { !selectedConversation &&
        <Loading/>
      }
    </React.Fragment>
   
  )
};

export default ChatScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameContainer: {
    marginLeft: 8,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
