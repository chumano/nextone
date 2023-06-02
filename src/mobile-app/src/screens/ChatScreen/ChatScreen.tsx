import React, {ReactElement, useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';

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
import {APP_THEME} from '../../constants/app.theme';
import {callActions} from '../../stores/call/callReducer';

interface ChatParams {
  conversationId: string;
}

const ChatScreen = ({navigation, route}: ChatStackProps) => {
  const dispatch = useDispatch();
  const {data: listConversation} = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const [otherUser, setOtherUser] = useState<UserStatus>();
  const [conversationId, setConversationId] = useState<string>();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  useLayoutEffect(() => {
    console.log('ChatScreen....', navigation.getState());
    const params = route.params;
    if (!params) {
      return;
    }
    const {conversationId} = params as ChatParams;
    setConversationId(conversationId);
  }, [navigation, route]);

  useEffect(() => {
    if (!listConversation || !userInfo || !conversationId) {
      return;
    }

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
    let otherUser: UserStatus | undefined;
    let conversationName: string;
    switch (conversationType) {
      case ConversationType.Peer2Peer: {
        const otherUserMember = selectedConversation.members.filter(
          m => m.userMember.userId !== userInfo.userId,
        )[0];

        otherUser = otherUserMember.userMember;

        conversationTypeIcon = <UserAvatar size={24} user={otherUser} />;
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
      headerShown: true,
      header: props => {
        return (
          <Appbar.Header
            style={{
              backgroundColor: APP_THEME.colors.primary,
            }}>
            {props.back && (
              <>
                <Appbar.BackAction
                  color={APP_THEME.colors.accent}
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                />
                <Appbar.Content
                  title={
                    <View style={styles.titleContainer}>
                      {conversationTypeIcon}
                      <Text numberOfLines={1} style={styles.titleText}>
                        {conversationName}
                      </Text>
                    </View>
                  }
                  color={APP_THEME.colors.accent}
                  titleStyle={styles.titleStyle}
                />
              </>
            )}

            {conversationType === ConversationType.Peer2Peer && (
              <>
                <Appbar.Action
                  size={20}
                  icon={'phone'}
                  color={APP_THEME.colors.accent}
                  onPress={() =>
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
                    )
                  }
                />

                <Appbar.Action
                  size={20}
                  icon={'video'}
                  color={APP_THEME.colors.accent}
                  onPress={() =>
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
                    )
                  }
                />

                <Appbar.Action
                  size={20}
                  icon={'information'}
                  color={APP_THEME.colors.accent}
                  onPress={() =>
                    navigation.navigate('UserDetailInfoScreen', {
                      conversationId,
                    })
                  }
                />
              </>
            )}

            {conversationType === ConversationType.Channel && (
              <Appbar.Action
                size={20}
                icon={'information'}
                color={APP_THEME.colors.accent}
                onPress={() => navigation.navigate('MembersScreen')}
              />
            )}
          </Appbar.Header>
        );
      },
    });
  }, [listConversation, conversationId, userInfo]);

  return (
    <>
      {selectedConversation && (
        <ChatBox key={conversationId} conversation={selectedConversation} />
      )}
      {!selectedConversation && <View style={{
         flex: 1,
      }}>
        <Loading />
        </View>}
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    marginLeft: 8,
    color: APP_THEME.colors.text,
  },
  titleStyle: {
    marginTop: 6,
  },
});
