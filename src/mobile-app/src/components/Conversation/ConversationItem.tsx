import React, {ReactElement} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {ConversationType} from '../../types/Conversation/ConversationType.type';

import UserAvatar from '../User/UserAvatar';
import ConversationAvatar from './ConversationAvatar';

import {ChatStackProps} from '../../navigation/ChatStack';

interface IProps {
  conversation: Conversation;
}

const ConversationItem: React.FC<IProps> = ({conversation}) => {
  const navigation = useNavigation<ChatStackProps>();

  let conversationType: ReactElement<any, any>;

  switch (conversation.type) {
    case ConversationType.Peer2Peer:
      conversationType = (
        <UserAvatar
          imageUri={conversation.members[0].userMember.userAvatarUrl}
          size={48}
        />
      );
      break;
    case ConversationType.Channel:
    case ConversationType.Private:
    case ConversationType.Group:
      conversationType = <ConversationAvatar icon="account-group" size={48} />;
      break;
  }

  const loadConversationHandler = () => {
    navigation.navigate('ChatScreen');
  };

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
          <Text style={styles.userNameText}>
            {conversation.members[0].userMember.userName}
          </Text>
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessageText}>OK! I got it</Text>
          </View>
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
