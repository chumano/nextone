import React from 'react';
import {Avatar} from 'react-native-paper';
import {APP_THEME} from '../../constants/app.theme';
import {StyleSheet, View} from 'react-native';

interface IProps {
  icon: string;
  size: number;
}

const ConversationAvatar: React.FC<IProps> = ({icon, size}) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon color={APP_THEME.colors.accent} size={size} icon={icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_THEME.colors.accent,
    borderRadius: 999,
  },
});

export default ConversationAvatar;
