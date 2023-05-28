import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';

import {AppDispatch, IAppStore} from '../../stores/app.store';
import {authLogin} from '../../stores/auth';
import {useNavigation} from '@react-navigation/native';
import {PublicScreenProp} from '../../navigation/PublicStack';
import {APP_THEME} from '../../constants/app.theme';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<PublicScreenProp>();
  const authState = useSelector((store: IAppStore) => store.auth);
  const [loginForm, setLoginForm] = useState({
    username: {
      value: '',
      isValid: true,
    },
    password: {
      value: '',
      isValid: true,
    },
  });
  const [showPassword, setShowPassword] = useState(true);

  const toggleShowPasswordHandler = () => setShowPassword(prev => !prev);

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

  const onRegisterHandler = () => {
    navigation.push('Register');
  };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 96}
      style={styles.container}>
      <View style={styles.loginForm}>
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name="account"
              size={48}
              color={APP_THEME.colors.primary}
            />
          </View>
        </View>
        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Tài khoản
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          value={loginForm.username.value}
          error={!loginForm.username.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'username')}
        />
        {!loginForm.username.isValid && (
          <HelperText type="error">Vui lòng nhập tài khoản!</HelperText>
        )}
        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Mật khẩu
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          secureTextEntry={showPassword}
          style={styles.input}
          value={loginForm.password.value}
          error={!loginForm.password.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'password')}
          right={
            showPassword ? (
              <TextInput.Icon
                onPress={toggleShowPasswordHandler}
                name="eye"
                size={16}
                color={APP_THEME.colors.accent}
              />
            ) : (
              <TextInput.Icon
                onPress={toggleShowPasswordHandler}
                name="eye-off"
                size={16}
                color={APP_THEME.colors.accent}
              />
            )
          }
        />
        {!loginForm.password.isValid && (
          <HelperText type="error">Vui lòng nhập mật khẩu!</HelperText>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            style={styles.buttonLogin}
            onPress={onLoginHandler}
            loading={authState.status === 'loading'}>
            Đăng nhập
          </Button>

          <Button
            labelStyle={{
              color: APP_THEME.colors.accent,
            }}
            mode="outlined"
            style={styles.buttonRegister}
            onPress={onRegisterHandler}>
            Đăng ký
          </Button>
        </View>

        <View style={styles.helperTextContainer}>
          {!!authState.error && (
            <HelperText type="error">{authState.error}</HelperText>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  loginForm: {
    width: '100%',
    shadowOpacity: 1,
    shadowRadius: APP_THEME.rounded,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    padding: APP_THEME.spacing.padding,
    borderRadius: APP_THEME.rounded,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 9999,
    backgroundColor: APP_THEME.colors.accent,
    padding: 8,
  },
  input: {
    width: '100%',
    height: 56,
    marginVertical: APP_THEME.spacing.between_component,
    backgroundColor: APP_THEME.colors.background,
  },
  buttonContainer: {
    marginTop: APP_THEME.spacing.between_component,
    width: '100%',
  },
  buttonRegister: {
    marginTop: APP_THEME.spacing.between_component,
  },
  buttonLogin: {
    backgroundColor: APP_THEME.colors.accent,
  },
  helperTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
