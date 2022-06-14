import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

export const ChangePasswordScreen = () => {
  const changePasswordHandler = () => {};
  const onChangeTextInput = () => {};
  return (
    <View style={styles.changePasswordScreenContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          label="OldPassword"
          right={<TextInput.Icon name="pencil" />}
          onChangeText={onChangeTextInput.bind(this, 'oldPassword')}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="NewPassword"
          right={<TextInput.Icon name="pencil" />}
          onChangeText={onChangeTextInput.bind(this, 'newPassword')}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="NewPasswordConfirmed"
          right={<TextInput.Icon name="pencil" />}
          onChangeText={onChangeTextInput.bind(this, 'newPasswordConfirmed')}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={changePasswordHandler}>
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
});
