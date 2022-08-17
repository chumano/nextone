import React, {useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {AppDispatch} from '../stores/app.store';

import {logout} from '../stores/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notificationApi} from '../apis/notificationApi';

export const AppTabNavigationBar: React.FC<BottomTabHeaderProps> = ({
  navigation,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [isVisible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToProfileHandler = () => {
    navigation.navigate('ProfileScreen');
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Appbar.Header>
      <Appbar.Content title="UCom" />

      <Menu
        visible={isVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" color="white" onPress={openMenu} />}>
        <Menu.Item title="Tài khoản" onPress={navigateToProfileHandler} />
        <Menu.Item title="Đăng xuất" onPress={logoutHandler} />
      </Menu>
    </Appbar.Header>
  );
};

export const AppStackNavigationBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  back,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToProfileHandler = () => {
    navigation.navigate('ProfileScreen');
  };

  const logoutHandler = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      const response = await notificationApi.removeToken(fcmToken);
      console.log('removeToken: ', response);
      await AsyncStorage.removeItem('fcmToken');
    }
    dispatch(logout());
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="UCOM" color="white" />

      {!back ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={openMenu} />
          }>
          <Menu.Item title="Tài khoản" onPress={navigateToProfileHandler} />
          <Menu.Item title="Đăng xuất" onPress={logoutHandler} />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
};
