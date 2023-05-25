import {useNavigation} from '@react-navigation/native';
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
import {APP_THEME} from '../../constants/app.theme';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RegisterScreen = () => {
  const navigation = useNavigation<PublicScreenProp>();
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
              navigation.goBack();
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 96 : 96}
      style={styles.container}>
      <View style={styles.registerForm}>
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name="form-select"
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
              Email
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          value={registerForm.email.value}
          error={!registerForm.email.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'email')}
        />
        {!registerForm.email.isValid && (
          <HelperText type="error">Vui lòng nhập email!</HelperText>
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
          secureTextEntry
          style={styles.input}
          value={registerForm.password.value}
          error={!registerForm.password.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'password')}
        />
        {!registerForm.password.isValid && (
          <HelperText type="error">Vui lòng nhập mật khẩu!</HelperText>
        )}

        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Xác nhận mật khẩu
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          secureTextEntry
          style={styles.input}
          value={registerForm.confirmPassword.value}
          error={!registerForm.confirmPassword.isValid}
          onChangeText={onInputChangeHandler.bind(this, 'confirmPassword')}
        />
        {!registerForm.confirmPassword.isValid && (
          <HelperText type="error">Mật khẩu không trùng khớp</HelperText>
        )}

        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonRegister}
            mode="contained"
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            onPress={onRegister}
            loading={loading}>
            Đăng ký
          </Button>
        </View>
      </View>
      {error && <HelperText type="error">{error}</HelperText>}
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  registerForm: {
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
    backgroundColor: APP_THEME.colors.accent,
  },
});
