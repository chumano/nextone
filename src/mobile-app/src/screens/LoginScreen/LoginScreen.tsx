import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {View, StyleSheet} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';

import {AppDispatch, IAppStore} from '../../stores/app.store';
import { authLogin } from '../../stores/auth';

const LoginScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const authState = useSelector((store: IAppStore) => store.auth);
  const [loginForm, setLoginForm] = useState({
    username: {
      value: 'manager@nextone.local',
      isValid: true,
    },
    password: {
      value: 'Nextone@123',
      isValid: true,
    },
  });

  const onLoginHandler = () => {
    const {username, password} = loginForm;
    //TODO: Check Validation
    const checkUserNameValid = username.value.trim().length > 0;
    const checkPasswordValid = password.value.trim().length > 0;

    if (!checkUserNameValid || !checkPasswordValid) {
      setLoginForm(prevState => ({
        username: {
          value: prevState.username.value,
          isValid: checkUserNameValid,
        },
        password: {
          value: prevState.password.value,
          isValid: checkPasswordValid,
        },
      }));

      return;
    }

    dispatch(authLogin({email: username.value, password: password.value}));
  };

  const onRegisterHandler = () => {};

  const onInputChangeHandler = (inputType: string, enteredText: string) => {
    setLoginForm(prevState => ({
      ...prevState,
      [inputType]: {
        value: enteredText,
        isValid: true,
      },
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}> Login Page </Text>
      <View style={styles.loginForm}>
        <TextInput
          label="Username or Email"
          style={styles.input}
          value={loginForm.username.value}
          error={!loginForm.username.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'username')}
        />
        {!loginForm.username.isValid && (
          <HelperText type="error">Username Field is required!</HelperText>
        )}
        <TextInput
          label="Password"
          secureTextEntry
          style={styles.input}
          value={loginForm.password.value}
          error={!loginForm.password.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'password')}
        />
        {!loginForm.password.isValid && (
          <HelperText type="error">Password Field is required!</HelperText>
        )}
      </View>
      {authState.error && (
        <HelperText type="error">{authState.error}</HelperText>
      )}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            mode="contained"
            onPress={onLoginHandler}
            loading={authState.status === 'loading'}>
            Login
          </Button>
        </View>
        <View style={styles.button}>
          <Button mode="contained" onPress={() => {}}>
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 24,
  },
  loginForm: {
    width: '80%',
  },
  input: {
    width: '100%',
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 8,
    width: '80%',
  },
  button: {
    marginVertical: 4,
  },
});
