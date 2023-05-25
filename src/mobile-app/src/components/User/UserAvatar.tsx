import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Badge} from 'react-native-paper';
import {Status, UserStatus} from '../../types/User/UserStatus.type';
import {APP_THEME} from '../../constants/app.theme';

interface IProps {
  size: number;
  user?: UserStatus;
}

const UserAvatar: React.FC<IProps> = ({size, user}) => {
  const isVisibleStatus = !!user;
  const statusColor =
    user?.status === Status.Online
      ? APP_THEME.colors.green
      : APP_THEME.colors.red;
  return (
    <View style={styles.container}>
      {!!user?.userAvatarUrl && (
        <Avatar.Image size={size} source={{uri: user?.userAvatarUrl}} />
      )}
      {!user?.userAvatarUrl && (
        <Avatar.Icon
          color={APP_THEME.colors.accent}
          icon="account"
          size={size}
        />
      )}
      <Badge
        visible={isVisibleStatus}
        size={10}
        style={{...styles.badgeContainer, backgroundColor: statusColor}}
      />
    </View>
  );
};

export default UserAvatar;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    top: 0,
    position: 'absolute',
  },
});
