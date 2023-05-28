import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  ChangePasswordScreen,
  DetailsScreen,
  HomeScreen,
  ProfileScreen,
} from '../screens/HomeScreen';
import {AppStackNavigationBar} from './AppNavigationBars';

type HomeStackParamsList = {
  HomeScreen: undefined;
  ProfileScreen: undefined;
  DetailsScreen: undefined;
  ChangePasswordScreen: undefined;
};

export type HomeStackProps = NativeStackScreenProps<
  HomeStackParamsList,
  'HomeScreen',
  'HomeStack'
>;

export type DetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamsList,
  'DetailsScreen'
>;

const Stack = createNativeStackNavigator<HomeStackParamsList>();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        header: (props: NativeStackHeaderProps) => {
          return <AppStackNavigationBar {...props} />;
        },
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home Page'}}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{title: 'Details Page'}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile Page',
        }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          title: 'ChangePassword Page',
        }}
      />
    </Stack.Navigator>
  );
};
export default HomeStack;
