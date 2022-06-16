import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {useDispatch} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {changeMyPassword} from '../../stores/user/user.thunk';

export const ChangePasswordScreen = () => {
  const userState = useSelector((store: IAppStore) => store.user);
  const dispatch: AppDispatch = useDispatch();
  const [isShowText, setIsShowText] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [passWordInput, setPasswordInput] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmed: '',
  });

  const changePasswordHandler = () => {
    const {oldPassword, newPassword, newPasswordConfirmed} = passWordInput;
    if (
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !newPasswordConfirmed.trim()
    )
      return;

    if (newPassword !== newPasswordConfirmed) return;

    dispatch(
      changeMyPassword({
        oldPassword,
        newPassword,
      }),
    );
  };

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    if (!updatedText.trim()) return;
    setIsDisabled(false);
    setPasswordInput(prevState => ({
      ...prevState,
      [updateField]: updatedText,
    }));
  };
  const toggleIconShowPassword = () => {
    setIsShowText(prevState => !prevState);
  };
  return (
    <View style={styles.changePasswordScreenContainer}>
      <View style={styles.toggleButtonContainer}>
        <Button onPress={toggleIconShowPassword}>
          {isShowText ? 'Show Password' : 'Hide Password'}
        </Button>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="OldPassword"
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'oldPassword')}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="NewPassword"
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'newPassword')}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="NewPasswordConfirmed"
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'newPasswordConfirmed')}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={changePasswordHandler}
            disabled={isDisabled}
            loading={userState.status === 'loading'}>
            Update
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  changePasswordScreenContainer: {
    marginTop: 8,
    padding: 8,
  },
  inputContainer: {
    paddingVertical: 8,
  },
  buttonsContainer: {},
  buttonContainer: {
    marginTop: 16,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});
