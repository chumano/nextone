import React from 'react';
import {Avatar} from 'react-native-paper';

interface IProps {
  icon: string;
  size: number;
}

const ConversationAvatar: React.FC<IProps> = ({icon, size}) => {
  return <Avatar.Icon size={size} icon={icon} />;
};
export default ConversationAvatar;
