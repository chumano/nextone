import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {updateMyProfile} from '../../stores/user';

import {User} from '../../types/User/User.type';
import {APP_THEME} from '../../constants/app.theme';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const DetailsScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((store: IAppStore) => store.user);
  const [userInfo, setUserInfo] = useState<User | null>(userState.data);
  const [isDisabled, setIsDisabled] = useState(true);

  if (!userInfo) {
    return <></>;
  }

  const onChangeTextInput = (updateField: string, updatedText: string) => {
    if (!userInfo) {
      return;
    }

    setUserInfo(prevState => {
      if (!prevState) {
        return null;
      }
      return {
        ...prevState,
        [updateField]: updatedText,
      };
    });

    setIsDisabled(false);
  };

  const updateProfileHandler = () => {
    dispatch(updateMyProfile({name: userInfo.name, phone: userInfo.phone}));
  };

  const {name, email, phone} = userInfo;

  return (
    <View style={styles.detailsScreenContainer}>
      <View style={styles.detailForm}>
        <View style={styles.centerContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcon
              name="account-edit"
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
              Tên
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          value={name}
          right={
            <TextInput.Icon
              name="pencil"
              color={APP_THEME.colors.accent}
              size={16}
            />
          }
          onChangeText={onChangeTextInput.bind(this, 'name')}
        />

        <TextInput style={styles.input} label="Email" value={email} disabled />

        <TextInput
          label={
            <Text
              style={{
                color: APP_THEME.colors.accent,
              }}>
              Số điện thoại
            </Text>
          }
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          keyboardType="number-pad"
          value={phone}
          right={
            <TextInput.Icon
              name="pencil"
              color={APP_THEME.colors.accent}
              size={16}
            />
          }
          onChangeText={onChangeTextInput.bind(this, 'phone')}
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
            disabled={isDisabled}
            mode="contained"
            onPress={updateProfileHandler}
            loading={userState.status === 'loading'}>
            Cập nhật
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsScreenContainer: {
    flex: 1,
    alignItems: 'center',
    padding: APP_THEME.spacing.padding,
    maxWidth: '100%',
  },
  detailForm: {
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
});
