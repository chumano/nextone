import React from 'react';
import {Avatar} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';

interface IProps {
  icon: string;
  size: number;
}

const ConversationAvatar: React.FC<IProps> = ({icon, size}) => {
  return (
    <Avatar.Icon color={APP_THEME.colors.accent} size={size} icon={icon} />
  );
};
export default ConversationAvatar;
