import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { authActions } from '../../stores/auth/authReducer';

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
        </View>
    )
}

export default LoginScreen