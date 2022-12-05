import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import NewsScreen from '../screens/NewsScreen/NewsScreen';
import {Appbar} from 'react-native-paper';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';

type PublicStackParamsList = {
  Login: undefined;
  News: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamsList>();

export type PublicScreenProp = NativeStackNavigationProp<
  PublicStackParamsList
>;

const PublicStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="News"
      screenOptions={{
        header: (props: NativeStackHeaderProps) => {
          return (
            <Appbar.Header>
              {props.back && (
                <Appbar.BackAction
                  color="white"
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                />
              )}
              <Appbar.Content title="UCOM" color="white" />
              {!props.back && (
                <Appbar.Action
                  icon="login"
                  color="white"
                  onPress={() =>
                    props.navigation.navigate('Login')
                  }></Appbar.Action>
              )}
            </Appbar.Header>
          );
        },
      }}>
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default PublicStack;
