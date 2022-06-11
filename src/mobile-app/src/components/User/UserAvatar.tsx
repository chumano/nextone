import React from 'react';
import {Avatar} from 'react-native-paper';

interface IProps {
  imageUri: string;
  size: number;
}

const UserAvatar: React.FC<IProps> = ({imageUri, size}) => {
  return <Avatar.Image size={size} source={{uri: imageUri}} />;
};

export default UserAvatar;
