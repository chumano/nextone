import {useNavigation} from '@react-navigation/native';
import {AxiosError} from 'axios';
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {authApi} from '../../apis';
import {PublicScreenProp} from '../../navigation/PublicStack';

const RegisterScreen = () => {
  const nagivation = useNavigation<PublicScreenProp>();
  const [registerForm, setRegisterForm] = useState({
    email: {
      value: '',
      isValid: true,
    },
    password: {
      value: '',
      isValid: true,
    },
    confirmPassword: {
      value: '',
      isValid: true,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onInputChangeHandler = (inputType: string, enteredText: string) => {
    setRegisterForm(prevState => ({
      ...prevState,
      [inputType]: {
        value: enteredText,
        isValid: true,
      },
    }));
  };

  const onRegister = async () => {
    const {email, password, confirmPassword} = registerForm;
    //TODO: Check Validation
    const checkEmailValid = email.value.trim().length > 0;
    const checkPasswordValid = password.value.trim().length > 0;
    const checkCorfirmPasswordValid = confirmPassword.value == password.value;
    if (!checkEmailValid || !checkPasswordValid || !checkCorfirmPasswordValid) {
      setRegisterForm(prevState => ({
        email: {
          value: prevState.email.value,
          isValid: checkEmailValid,
        },
        password: {
          value: prevState.password.value,
          isValid: checkPasswordValid,
        },
        confirmPassword: {
          value: prevState.confirmPassword.value,
          isValid: checkCorfirmPasswordValid,
        },
      }));

      return;
    }

    setError(undefined);
    setLoading(true);
    try {
      var response = await authApi.register(email.value, password.value);
      if (response.isSuccess) {
        Alert.alert('Đã đăng ký thành công', '', [
          {
            text: 'Đăng nhập',
            onPress: () => {
              //back to login screen
              nagivation.goBack();
            },
          },
        ]);
        return;
      }

      setError(response.errorMessage || 'Lỗi bất thường');
    } catch (err: any) {
      setError('Internal Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 96}
      style={styles.container}>
      <Text style={styles.headerText}> Đăng ký </Text>
      <View style={styles.loginForm}>
        <TextInput
          label="Email"
          style={styles.input}
          value={registerForm.email.value}
          error={!registerForm.email.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'email')}
        />
        {!registerForm.email.isValid && (
          <HelperText type="error">Email phải nhập</HelperText>
        )}
        <TextInput
          label="Mật khẩu"
          secureTextEntry
          style={styles.input}
          value={registerForm.password.value}
          error={!registerForm.password.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'password')}
        />
        {!registerForm.password.isValid && (
          <HelperText type="error">Mật khẩu phải nhập</HelperText>
        )}

        <TextInput
          label="Nhập lại mật khẩu"
          secureTextEntry
          style={styles.input}
          value={registerForm.confirmPassword.value}
          error={!registerForm.confirmPassword.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'confirmPassword')}
        />
        {!registerForm.confirmPassword.isValid && (
          <HelperText type="error">Mật khẩu không trùng khớp</HelperText>
        )}
      </View>
      {error && <HelperText type="error">{error}</HelperText>}
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button mode="contained" onPress={onRegister} loading={loading}>
            Đăng ký
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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
