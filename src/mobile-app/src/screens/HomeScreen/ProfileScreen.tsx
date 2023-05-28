import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

import {APP_THEME} from '../../constants/app.theme';

import Loading from '../../components/Loading';

import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getMyProfile} from '../../stores/user';

import {HomeStackProps} from '../../navigation/HomeStack';
import {userApi} from '../../apis/user.api';
import {logout} from '../../stores/auth';

export const ProfileScreen = ({navigation}: HomeStackProps) => {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((store: IAppStore) => store.user);
  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  const changeProfileHandler = () => {
    navigation.navigate('DetailsScreen');
  };

  const changePasswordHandler = () => {
    navigation.navigate('ChangePasswordScreen');
  };
  const [visible, setVisible] = React.useState(false);

  const hideModal = () => setVisible(false);

  const deleteUserHandlder = () => {
    setVisible(true);
  };

  if (userState.status === 'loading' || !userState.data) {
    return <Loading />;
  }

  return (
    <View style={styles.profileScreenContainer}>
      <View style={styles.profileForm}>
        <View style={styles.userAvatarContainer}>
          <Avatar.Icon style={styles.avatar} icon="account" size={48} />
          <Text style={styles.userNameText}>{userState.data.name}</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email: </Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              style={styles.input}
              disabled
              defaultValue={userState.data.email}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Số điện thoại: </Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput
              style={styles.input}
              disabled
              defaultValue={userState.data.phone}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            style={styles.buttonUpdate}
            mode="contained"
            onPress={changeProfileHandler}>
            Cập nhật thông tin
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.accent,
            }}
            mode="outlined"
            onPress={changePasswordHandler}>
            Đổi mật khẩu
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            labelStyle={{
              color: APP_THEME.colors.primary,
            }}
            mode="contained"
            color={APP_THEME.colors.red}
            onPress={deleteUserHandlder}>
            Xóa tài khoản
          </Button>
        </View>
      </View>

      {Platform.OS === 'ios' && (
        <DeleteUserModal visible={visible} hideModal={hideModal} />
      )}
    </View>
  );
};

const DeleteUserModal: React.FC<{visible: boolean; hideModal: () => void}> = ({
  visible,
  hideModal,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState<any>({
    value: '',
    isValid: true,
    errorMessage: undefined,
  });
  const onDelete = async () => {
    if (password.value.trim().length === 0) {
      setPassword((state: any) => ({
        ...state,
        isValid: false,
      }));
      return;
    }

    const response = await userApi.selfDelete(password.value);
    //console.log("selfDelete ressponse:" , response)
    if (!response.isSuccess) {
      Alert.alert('Có lỗi', response.errorMessage!);
      return;
    }

    setPassword((state: any) => ({
      ...state,
      isValid: false,
      errorMessage: response.errorMessage,
    }));
    Alert.alert('Xóa tài khoản thàng công');
    hideModal();
    dispatch(logout());
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.modalTitleText}>Bạn có muốn xóa tài khoản?</Text>
        </View>

        <TextInput
          style={styles.input}
          mode={'flat'}
          placeholder={'Xác nhận mật khẩu'}
          activeUnderlineColor={APP_THEME.colors.accent}
          secureTextEntry
          value={password.value}
          error={!password.isValid}
          onChangeText={txt =>
            setPassword({
              value: txt,
              isValid: true,
            })
          }
        />
        {!password.isValid && (
          <HelperText type="error">
            {password.errorMessage || 'Vui lòng nhập mật khẩu!'}
          </HelperText>
        )}

        <Button
          mode={'contained'}
          color={APP_THEME.colors.red}
          onPress={onDelete}>
          Xác nhận
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  profileScreenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  profileForm: {
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
  userAvatarContainer: {
    alignItems: 'center',
    marginBottom: 2 * APP_THEME.spacing.between_component,
  },
  avatar: {
    marginBottom: APP_THEME.spacing.between_component,
    backgroundColor: APP_THEME.colors.accent,
  },
  userNameText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: APP_THEME.spacing.between_component,
    backgroundColor: APP_THEME.colors.background,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: `${APP_THEME.colors.black}3a`,
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  valueContainer: {
    flex: 1,
  },
  labelText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
  },
  buttonContainer: {
    marginTop: APP_THEME.spacing.between_component,
    width: '100%',
  },
  buttonUpdate: {
    backgroundColor: APP_THEME.colors.accent,
  },

  /* Modal */

  modalContainer: {
    backgroundColor: APP_THEME.colors.background,
    padding: APP_THEME.spacing.padding,
  },
  modalTitleContainer: {
    marginBottom: APP_THEME.spacing.between_component,
  },
  modalTitleText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: 'normal',
    color: APP_THEME.colors.red,
  },
});
