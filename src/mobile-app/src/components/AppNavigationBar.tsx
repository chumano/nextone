import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { Appbar } from 'react-native-paper';

const AppNavigationBar: React.FC<NativeStackHeaderProps> = ({ navigation, back }) => {
    return (
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title="My awesome app" />
        </Appbar.Header>
    );
}

export default AppNavigationBar;