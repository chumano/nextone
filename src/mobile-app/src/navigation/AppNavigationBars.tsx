import React, {useState} from 'react';
import {Appbar, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

import {AppDispatch} from '../stores/app.store';

import {logout} from '../stores/auth';
import {APP_THEME} from '../constants/app.theme';
import {StyleSheet} from 'react-native';

export const AppStackNavigationBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  back,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigateToProfileHandler = () => {
    closeMenu();
    navigation.navigate('ProfileScreen');
  };

  const logoutHandler = async () => {
    closeMenu();
    dispatch(logout());
  };

  return (
    <Appbar.Header>
      {back ? (
        <Appbar.BackAction
          color={APP_THEME.colors.accent}
          onPress={navigation.goBack}
        />
      ) : null}
      <Appbar.Content
        title="UCOM"
        color={APP_THEME.colors.accent}
        titleStyle={styles.title}
      />

      {!back ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="menu"
              color={APP_THEME.colors.accent}
              onPress={openMenu}
            />
          }>
          <Menu.Item title="Tài khoản" onPress={navigateToProfileHandler} />
          <Menu.Item title="Đăng xuất" onPress={logoutHandler} />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
};

//not use
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

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
