import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { authActions } from '../../stores/auth/authReducer';
import { callActions } from '../../stores/call/callReducer';

const LoginScreen = () => {
    const dispatch = useDispatch();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> LoginPage</Text>
            <Button icon="camera" mode="contained"
                onPress={() => {
                    console.log("LoginScreen-LoginButton-onPress")
                    dispatch(authActions.login());
                }}
            >
                Login
            </Button>
            <Button icon="camera" mode="contained"
                onPress={() => {
                    console.log("LoginScreen-CallButton-onPress")
                    dispatch(callActions.call());
                }}
            >
                CAll
            </Button>
        </View>
    )
}

export default LoginScreen