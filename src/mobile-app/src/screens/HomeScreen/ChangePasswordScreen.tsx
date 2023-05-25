import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {changeMyPassword} from '../../stores/user';
import {APP_THEME} from '../../constants/app.theme';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    ) {
      return;
    }

    if (newPassword !== newPasswordConfirmed) {
      return;
    }

    dispatch(
      changeMyPassword({
        oldPassword,
        newPassword,
      }),
    );
  };

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    if (!updatedText.trim()) {
      return;
    }
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
      <View style={styles.changePasswordForm}>
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name="lock-reset"
              size={48}
              color={APP_THEME.colors.primary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.toggleButtonContainer}
          onPress={toggleIconShowPassword}>
          <Text style={styles.showPasswordText}>Hiển thị mật khẩu? </Text>
          {isShowText ? (
            <MaterialCommunityIcon
              name="eye-off"
              size={16}
              color={APP_THEME.colors.link}
            />
          ) : (
            <MaterialCommunityIcon
              name="eye"
              size={16}
              color={APP_THEME.colors.link}
            />
          )}
        </TouchableOpacity>

        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Mật khẩu hiện tại
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'oldPassword')}
          right={
            <TextInput.Icon
              name="pencil"
              color={APP_THEME.colors.accent}
              size={16}
            />
          }
        />

        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Mật khẩu mới
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'newPassword')}
          right={
            <TextInput.Icon
              name="pencil"
              color={APP_THEME.colors.accent}
              size={16}
            />
          }
        />

        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Nhập lại mật khẩu mới
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          secureTextEntry={isShowText}
          onChangeText={onChangeTextInput.bind(this, 'newPasswordConfirmed')}
          right={
            <TextInput.Icon
              name="pencil"
              color={APP_THEME.colors.accent}
              size={16}
            />
          }
        />

        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            style={{
              backgroundColor: isDisabled
                ? APP_THEME.colors.disabled
                : APP_THEME.colors.accent,
            }}
            mode="contained"
            onPress={changePasswordHandler}
            disabled={isDisabled}
            loading={userState.status === 'loading'}>
            Cập nhật
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  changePasswordScreenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  changePasswordForm: {
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
    marginBottom: 2 * APP_THEME.spacing.between_component,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  showPasswordText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    color: APP_THEME.colors.link,
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
});
