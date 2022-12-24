import React from 'react';
import { StyleSheet, View } from 'react-native';
import {Avatar, Badge, Text} from 'react-native-paper';
import { Status, UserStatus } from '../../types/User/UserStatus.type';

interface IProps {
  size: number;
  user?: UserStatus
}

const UserAvatar: React.FC<IProps> = ({ size, user}) => {
  const isVisibleStatus = !!user;
  const statusColor = user?.status=== Status.Online? 'green': 'red';
  return <View style={styles.container}>
    {!!user?.userAvatarUrl && 
      <Avatar.Image size={size} source={{uri: user?.userAvatarUrl}} />
    }
    {!user?.userAvatarUrl && 
      <Avatar.Icon icon="account" size={size} />
    }
    <Badge
      visible={isVisibleStatus}  size={10*size/48} 
      style={{ top: 0, position: 'absolute', backgroundColor: statusColor }} />
  </View> 
   
};

export default UserAvatar;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
