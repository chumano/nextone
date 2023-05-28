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
import {APP_THEME} from '../constants/app.theme';
import {StyleSheet} from 'react-native';

type PublicStackParamsList = {
  Login: undefined;
  News: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamsList>();

export type PublicScreenProp = NativeStackNavigationProp<PublicStackParamsList>;

const PublicStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="News"
      screenOptions={{
        header: (props: NativeStackHeaderProps) => {
          return (
            <Appbar.Header
              style={{
                backgroundColor: APP_THEME.colors.primary,
              }}>
              {props.back && (
                <Appbar.BackAction
                  color={APP_THEME.colors.accent}
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                />
              )}
              <Appbar.Content
                title={'UCOM'}
                color={APP_THEME.colors.accent}
                titleStyle={styles.title}
              />
              {!props.back && (
                <Appbar.Action
                  icon={'login'}
                  color={APP_THEME.colors.accent}
                  onPress={() => props.navigation.navigate('Login')}
                />
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

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default PublicStack;
