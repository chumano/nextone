import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text, TextInput, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {APP_THEME} from '../../constants/app.theme';

import Loading from '../../components/Loading';

import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getMyProfile} from '../../stores/user';

import {HomeStackProps} from '../../navigation/HomeStack';

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

  if (userState.status === 'loading' || !userState.data) return <Loading />;

  return (
    <SafeAreaView style={styles.profileContainer}>
      <View style={styles.userAvatarContainer}>
        <Avatar.Icon icon="account" size={72}></Avatar.Icon>
        <View style={styles.userNameContainer}>
          <Text style={styles.userNameText}>{userState.data.name}</Text>
        </View>
      </View>
      <View style={styles.userInfoContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput disabled defaultValue={userState.data.email}></TextInput>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Số điện thoại</Text>
          </View>
          <View style={styles.valueContainer}>
            <TextInput disabled defaultValue={userState.data.phone}></TextInput>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={changeProfileHandler}>
            Cập nhật thông tin
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={changePasswordHandler}>
            Đổi mật khẩu
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingTop: 16,
  },
  userAvatarContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: APP_THEME.colors.placeholder,
  },
  userNameContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  userInfoContainer: {
    marginHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,

    borderBottomWidth: 0.5,
    borderColor: APP_THEME.colors.placeholder,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  valueContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  labelText: {
    fontWeight: '200',
  },
  userNameText: {
    fontSize: 24,
  },
});
