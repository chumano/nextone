import React, {useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {AppDispatch} from '../stores/app.store';

import {logout} from '../stores/auth';

export const AppTabNavigationBar: React.FC<BottomTabHeaderProps> = ({
  navigation,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const [isVisible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToProfileHandler = () => {
    navigation.navigate('Profile');
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
  route,
  navigation,
  back,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const routeName = route.name;

  const navigateToProfileHandler = () => {
    navigation.navigate('Profile');
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="UCOM" />

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
