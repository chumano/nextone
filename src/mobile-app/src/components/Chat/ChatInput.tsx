import React, {useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {IconButton} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';

interface IProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<IProps> = ({onSendMessage}) => {
  const [isKeyPress, setIsKeyPress] = useState(false);
  const [message, setMessage] = useState('');

  const onKeyPressHandler = () => {
    setIsKeyPress(true);
  };

  const onChangeTextHandler = (text: string) => {
    setMessage(text);
  };

  const sendMessageHandler = () => {
    onSendMessage(message);
    setMessage('');
  };

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
            onChangeText={onChangeTextHandler}
            onKeyPress={onKeyPressHandler}
            multiline={true}
            numberOfLines={3}
            placeholder="Enter your message"
            value={message}
          />
        </View>
        {isKeyPress ? (
          <View style={styles.iconButtonsContainer}>
            <View style={styles.iconButtonContainer}>
              <IconButton
                onPress={sendMessageHandler}
                style={styles.button}
                icon="send"
                size={24}
              />
            </View>
          </View>
        ) : (
          <View style={styles.iconButtonsContainer}>
            <View style={styles.iconButtonContainer}>
              <IconButton style={styles.button} icon="file" size={24} />
            </View>
            <View style={styles.iconButtonContainer}>
              <IconButton style={styles.button} icon="file-image" size={24} />
            </View>
          </View>
        )}
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
    maxHeight: 72
  },
  button: {
    padding: 4,
    margin: 0,
  },
});
