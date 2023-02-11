import React, {ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';

import {ChatStackProps} from '../../navigation/ChatStack';

import {useDispatch, useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';

import UserAvatar from '../../components/User/UserAvatar';
import ChatBox from '../../components/Chat/ChatBox';
import ConversationAvatar from '../../components/Conversation/ConversationAvatar';

import {ConversationType} from '../../types/Conversation/ConversationType.type';
import {UserStatus} from '../../types/User/UserStatus.type';
import {Conversation} from '../../types/Conversation/Conversation.type';
import Loading from '../../components/Loading';
import { callActions } from '../../stores/call/callReducer';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

interface ChatParams {
  conversationId: string;
}

const ChatScreen = ({navigation, route}: ChatStackProps) => {
  const dispatch = useDispatch();
  const {data: listConversation} = useSelector((store: IAppStore) => store.conversation);
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const [otherUser, setOtherUser] = useState<UserStatus>();
  const [conversationId, setConversationId] = useState<string>();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();

  useLayoutEffect(() => {
    console.log('ChatScreen....',navigation.getState())
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

    if (!selectedConversation) {
      //load not find conversation
      return;
    }

    setSelectedConversation(selectedConversation);

    const conversationType = selectedConversation.type;
    let conversationTypeIcon: ReactElement<any, any>;
    let otherUser : UserStatus | undefined = undefined;
    let conversationName: string;
    switch (conversationType) {
      case ConversationType.Peer2Peer: {
        const otherUserMember = selectedConversation.members.filter(
          m => m.userMember.userId !== userInfo.userId,
        )[0];

        otherUser = otherUserMember.userMember;
        
        conversationTypeIcon =<UserAvatar size={24} user={otherUser}/>
        conversationName = otherUser.userName;
        
        break;
      }
      case ConversationType.Channel:
      case ConversationType.Private:
      case ConversationType.Group:
        conversationTypeIcon = (
          <ConversationAvatar icon="account-group" size={24} />
        );
        conversationName = selectedConversation.name;
        break;
    }
    setOtherUser(otherUser);

    navigation.setOptions({
      title: `${conversationName}`,
      headerTitle: ({children}) => (
        <View style={styles.headerContainer}>
          {conversationTypeIcon}
          <View style={styles.userNameContainer}>
            <Text style={styles.userNameText}>{children}</Text>
          </View>
        </View>
      ),
      headerRight: () => {
        const iconSize = 20;
        return (
          <>
            {conversationType === ConversationType.Peer2Peer && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      callActions.call({
                        callInfo: {
                          type: 'call',
                          senderId: '',
                          senderName: conversationName,
                          conversationId: conversationId,
                          callType: 'voice',
                        },
                      }),
                    );
                  }}>
                  <AwesomeIcon name="phone" size={iconSize} color={'#000'} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginHorizontal: 20}}
                  onPress={() => {
                    dispatch(
                      callActions.call({
                        callInfo: {
                          type: 'call',
                          senderId: '',
                          senderName: conversationName,
                          conversationId: conversationId,
                          callType: 'video',
                        },
                      }),
                    );
                  }}>
                  <AwesomeIcon name="video" size={iconSize} color={'#000'} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserDetailInfoScreen', {
                      conversationId,
                    });
                  }}>
                  <AwesomeIcon name="info" size={iconSize} color={'#000'} />
                </TouchableOpacity>
              </>
            )}
            {conversationType === ConversationType.Channel && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MembersScreen');
                  }}>
                  <AwesomeIcon name="info" size={iconSize} color={'#000'} />
                </TouchableOpacity>
              </>
            )}
          </>
        );
      },
    });
  },[listConversation,conversationId, userInfo]);
  
  return (
    <React.Fragment>
      { selectedConversation &&
        <ChatBox key={conversationId} conversation={selectedConversation} />
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
