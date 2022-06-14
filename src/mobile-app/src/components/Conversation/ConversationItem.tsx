import React, {ReactElement} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Avatar, Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {ConversationType} from '../../types/Conversation/ConversationType.type';

import UserAvatar from '../User/UserAvatar';
import ConversationAvatar from './ConversationAvatar';

import {ConversationScreenProp} from '../../navigation/ChatStack';

import {useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';

interface IProps {
  conversation: Conversation;
}

const ConversationItem: React.FC<IProps> = ({conversation}) => {
  const navigation = useNavigation<ConversationScreenProp>();
  const {data} = useSelector((store: IAppStore) => store.auth);

  let conversationType: ReactElement<any, any>;
  let conversationName: string;

  switch (conversation.type) {
    case ConversationType.Peer2Peer: {
      const otherUser = conversation.members.filter(
        m => m.userMember.userId !== data?.userId,
      )[0];

      conversationType =
        otherUser.userMember.userAvatarUrl !== '' ? (
          <UserAvatar imageUri={otherUser.userMember.userAvatarUrl} size={48} />
        ) : (
          <Avatar.Icon icon="account" size={48} />
        );

      conversationName = otherUser.userMember.userName;
      break;
    }
    case ConversationType.Channel:
    case ConversationType.Private:
    case ConversationType.Group:
      conversationType = <ConversationAvatar icon="account-group" size={48} />;
      conversationName = conversation.name;
      break;
  }

  const loadConversationHandler = () => {
    if (!data) return;

    navigation.navigate('ChatScreen', {
      userId: data.userId,
      conversationId: conversation.id,
    });
  };

  const isConversationHaveMessage =
    conversation && conversation.messages && conversation.messages.length > 0;

  return (
    <Pressable
      onPress={loadConversationHandler}
      style={({pressed}) => [
        styles.conversationContainer,
        pressed && styles.conversationPressed,
      ]}>
      <View style={styles.conversionType}>{conversationType}</View>
      <View style={styles.conversationInformation}>
        <View style={styles.conversationContent}>
          <Text style={styles.userNameText}>{conversationName}</Text>
          {isConversationHaveMessage && (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessageText}>
                {
                  conversation.messages[0]
                    .content
                }
              </Text>
            </View>
          )}
        </View>
        <View style={styles.conversationUpdatedDate}>
          <Text style={styles.updatedDateText}>{conversation.updatedDate}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  conversationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  conversionType: {},
  conversationInformation: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 24,
    marginLeft: 16,
    borderBottomColor: APP_THEME.colors.disabled,
    borderBottomWidth: 0.2,
  },
  conversationContent: {
    flexDirection: 'column',
  },
  conversationUpdatedDate: {
    marginLeft: 'auto',
  },
  conversationPressed: {
    opacity: 0.7,
  },
  lastMessageContainer: {
    marginTop: 4,
  },
  userNameText: {
    fontSize: 16,
  },
  lastMessageText: {
    fontSize: 12,
  },
  updatedDateText: {
    fontSize: 12,
    fontWeight: '200',
  },
});
