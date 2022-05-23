import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { authActions } from '../stores/auth/authReducer';

export const AppTabNavigationBar: React.FC<BottomTabHeaderProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Appbar.Header>
            <Appbar.Content title="UCom" />

            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu} />
                }>
                <Menu.Item title="Tài khoản" onPress={() => { 
                    console.log('Tài khoản was pressed') 
                    navigation.navigate("Profile")
                }}  />
                <Menu.Item title="Đăng xuất" onPress={() => { 
                    dispatch(authActions.logout());
                }} />
            </Menu>

        </Appbar.Header>
    );
}

export const AppStackNavigationBar: React.FC<NativeStackHeaderProps> = ({ route, navigation, back }) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const routeName = route.name;

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
                    <Menu.Item title="Tài khoản" onPress={() => { 
                    console.log('Tài khoản was pressed') 
                    navigation.navigate("Profile")
                }}  />
                <Menu.Item title="Đăng xuất" onPress={() => { 
                    dispatch(authActions.logout());
                }} />
                </Menu>
            ) : null}

        </Appbar.Header>
    );
}
