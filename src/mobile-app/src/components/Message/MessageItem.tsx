import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

import UserAvatar from '../User/UserAvatar';

import {Message} from '../../types/Message/Message.type';
import {useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';
interface IProps {
  message: Message;
}

const MessageItem: React.FC<IProps> = ({message}) => {
  const authState = useSelector((store: IAppStore) => store.auth);
  const isOwnerMessage =
    authState.data?.userId === message.userSender.userId ?? false;

  const userAvatar =
    message.userSender.userAvatarUrl !== '' ? (
      <UserAvatar imageUri={message.userSender.userAvatarUrl} size={24} />
    ) : (
      <Avatar.Icon icon="account" size={24} />
    );

  return (
    <View
      style={[
        styles.messageContainer,
        isOwnerMessage && styles.ownerMessageContainer,
      ]}>
      {userAvatar}
      <View
        style={[
          styles.messageContentContainer,
          isOwnerMessage && styles.ownerMessageContentContainer,
        ]}>
        <Text>{message.content.trim()}</Text>
      </View>
    </View>
  );
};

export default MessageItem;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  ownerMessageContainer: {
    flexDirection: 'row-reverse',
  },
  messageContentContainer: {
    marginLeft: 8,
    marginRight: 0,
    padding: 8,
    maxWidth: '80%',
    borderRadius: 8,
    backgroundColor: APP_THEME.colors.white,
  },
  ownerMessageContentContainer: {
    marginRight: 8,
    marginLeft: 0,
  },
});
