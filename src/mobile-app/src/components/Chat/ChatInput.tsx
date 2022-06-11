import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {IconButton} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';

const ChatInput = () => {
  return (
    <View style={styles.chatInputContainer}>
      <View style={styles.chatInputInnerContainer}>
        <View style={styles.iconButtonContainer}>
          <IconButton
            style={styles.button}
            icon="emoticon-happy-outline"
            size={24}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            multiline={true}
            numberOfLines={3}
            placeholder="Enter your message"
          />
        </View>
        <View style={styles.iconButtonsContainer}>
          <View style={styles.iconButtonContainer}>
            <IconButton style={styles.button} icon="file" size={24} />
          </View>
          <View style={styles.iconButtonContainer}>
            <IconButton style={styles.button} icon="file-image" size={24} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  chatInputContainer: {
    paddingBottom: 24,
    backgroundColor: APP_THEME.colors.white,
  },
  chatInputInnerContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  iconButtonsContainer: {
    flexDirection: 'row',
  },
  iconButtonContainer: {
    alignSelf: 'center',

    marginHorizontal: 4,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    padding: 4,
    margin: 0,
  },
});
