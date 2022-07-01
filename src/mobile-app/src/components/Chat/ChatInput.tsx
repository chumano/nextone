import React, {useCallback, useState} from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import {IconButton} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';
import {ImageLibraryOptions, launchCamera, 
  launchImageLibrary} from 'react-native-image-picker';

interface IProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<IProps> = ({onSendMessage}) => {
  const [isKeyPress, setIsKeyPress] = useState(false);
  const [sendBtnVisible, setSendBtnVisible] = useState(false);
  const [message, setMessage] = useState('');

  const onKeyPressHandler = () => {
    setIsKeyPress(true);
  };

  const onChangeTextHandler = (text: string) => {
    if(text.length>0){
      setSendBtnVisible(true)
    }else{
      setSendBtnVisible(false)
    }
    setMessage(text);
    
  };

  const sendMessageHandler = () => {
    onSendMessage(message);
    setMessage('');
  };

  const pickFile = useCallback(()=>{

  },[])

  const pickImage = useCallback(async ()=>{
    const options :ImageLibraryOptions = {
      mediaType : 'photo'
    }
    const result = await launchImageLibrary(options);
    console.log('pickImage' , result)
  },[])

  return (
    <View style={styles.chatInputContainer}>
      <View style={styles.chatInputInnerContainer}>
        {/* <View style={styles.iconButtonContainer}>
          <IconButton
            style={styles.button}
            icon="emoticon-happy-outline"
            size={24}
          />
        </View> */}
        <View style={styles.inputContainer}>
          <TextInput
            style={{color:'#000'}}
            onChangeText={onChangeTextHandler}
            onKeyPress={onKeyPressHandler}
            multiline={true}
            numberOfLines={3}
            placeholder="Enter your message"
            value={message}
          />
        </View>
        {sendBtnVisible ? (
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
              <IconButton style={styles.button} icon="paperclip" size={24} onPress={pickFile} />
            </View>
            <View style={styles.iconButtonContainer}>
              <IconButton style={styles.button} icon="file-image" size={24} onPress={pickImage}/>
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
    paddingBottom: 0,
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
    maxHeight: 48
  },
  button: {
    padding: 4,
    margin: 0,
  },
});
