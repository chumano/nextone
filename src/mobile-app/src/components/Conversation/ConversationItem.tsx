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
import {useDispatch} from 'react-redux';
import {conversationActions} from '../../stores/conversation';
import {MessageType} from '../../types/Message/MessageType.type';
import {frowNow} from '../../utils/date.utils';

interface IProps {
  conversation: Conversation;
}

const ConversationItem: React.FC<IProps> = ({conversation}) => {
  const dispatch = useDispatch();
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
    dispatch(conversationActions.selectConversation(conversation.id));
    navigation.navigate('ChatScreen', {
      conversationId: conversation.id,
      name: conversationName,
      conversationType: conversation.type
    });
  };

  const isConversationHaveMessage =
    conversation && conversation.messages && conversation.messages.length > 0;

  const renderLastMessageText = () => {
    let lastMessageText = '';
    if (isConversationHaveMessage) {
      const lastMessage = conversation.messages[0];
      if (conversation.type !== ConversationType.Peer2Peer) {
        lastMessageText += lastMessage.userSender.userName + ': ';
      }
      if (lastMessage.type === MessageType.Text || lastMessage.type === MessageType.CallMessage || lastMessage.type === MessageType.CallEndMessage) {
        let content = lastMessage.content.replace(/[\r\n]+/g, ' ');
        if (content.length > 20) {
          content = content.slice(0, 20).trim() + '...';
        }
        lastMessageText += content;
      } else if (lastMessage.type === MessageType.ImageFile) {
        lastMessageText += 'Hình ảnh';
      } else if (lastMessage.type === MessageType.OtherFile) {
        lastMessageText += 'Tệp tin';
      } else if (lastMessage.type === MessageType.Event) {
        lastMessageText += 'Sự kiện';
      }
    }
    return lastMessageText;
  };
  const displayDate = frowNow(conversation.updatedDate!);
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
                {renderLastMessageText()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.conversationUpdatedDate}>
          <Text style={styles.updatedDateText}>{displayDate}</Text>
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
    opacity: 0.5,
  },
  updatedDateText: {
    fontSize: 12,
    fontWeight: '200',
  },
});
