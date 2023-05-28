import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {ConversationType} from '../../types/Conversation/ConversationType.type';

import UserAvatar from '../User/UserAvatar';
import ConversationAvatar from './ConversationAvatar';

import {ConversationScreenProp} from '../../navigation/ChatStack';

import {useDispatch, useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';
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

      conversationType = <UserAvatar size={48} user={otherUser.userMember} />;

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
    if (!data) {
      return;
    }
    dispatch(conversationActions.selectConversation(conversation.id));
    navigation.navigate('ChatScreen', {
      conversationId: conversation.id,
    });
  };

  const isConversationHaveMessage =
    conversation && conversation.messages && conversation.messages.length > 0;

  const renderLastMessageText = () => {
    let lastMessageText = '';
    if (isConversationHaveMessage) {
      const lastMessage = conversation.messages[0];
      const {isDeleted} = lastMessage;
      if (isDeleted) {
        return 'Tin nhắn đã bị xóa';
      }

      if (conversation.type !== ConversationType.Peer2Peer) {
        lastMessageText += lastMessage.userSender.userName + ': ';
      }
      if (
        lastMessage.type === MessageType.Text ||
        lastMessage.type === MessageType.CallMessage ||
        lastMessage.type === MessageType.CallEndMessage
      ) {
        let content = lastMessage.content.replace(/[\r\n]+/g, ' ');
        if (content.length > 20) {
          content = content.slice(0, 20).trim() + '...';
        }
        lastMessageText += content;
      } else if (lastMessage.type === MessageType.ImageFile) {
        lastMessageText += 'Hình ảnh';
      } else if (lastMessage.type === MessageType.OtherFile) {
        lastMessageText += 'Tệp tin';
      } else if (lastMessage.type === MessageType.AudioFile) {
        lastMessageText += 'Ghi âm';
      } else if (lastMessage.type === MessageType.Event) {
        lastMessageText += 'Sự kiện';
      }
    }
    return lastMessageText;
  };
  const date =
    conversation.messages.length > 0
      ? conversation.messages[0].sentDate
      : undefined;
  const displayDate = frowNow(date || conversation.updatedDate!);
  return (
    <TouchableOpacity
      onPress={loadConversationHandler}
      style={styles.conversationContainer}>
      <View style={styles.conversionType}>{conversationType}</View>
      <View style={styles.conversationInformation}>
        <View style={styles.conversationContent}>
          <Text numberOfLines={1} style={styles.userNameText}>
            {conversationName}
          </Text>
          {isConversationHaveMessage && (
            <View style={styles.lastMessageContainer}>
              <Text numberOfLines={1} style={styles.lastMessageText}>
                {renderLastMessageText()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.conversationUpdatedDate}>
          <Text style={styles.updatedDateText}>{displayDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  conversationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: APP_THEME.spacing.between_component,

    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: APP_THEME.rounded,
  },
  conversionType: {},
  conversationInformation: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: APP_THEME.spacing.between_component,
  },
  conversationContent: {
    maxWidth: '70%',
  },
  conversationUpdatedDate: {
    marginLeft: 'auto',
  },
  lastMessageContainer: {
    marginTop: 2,
  },
  userNameText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'normal',
  },
  lastMessageText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
    opacity: 0.7,
  },
  updatedDateText: {
    fontSize: 10,
    fontWeight: '300',
    color: APP_THEME.colors.text,
  },
});
