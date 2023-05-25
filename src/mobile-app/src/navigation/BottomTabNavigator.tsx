import React from 'react';

import {
  BottomTabHeaderProps,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import EventStack from './EventStack';
import MapStack from './MapStack';
import ChatStack from './ChatStack';
import HomeStack from './HomeStack';
import {APP_THEME} from '../constants/app.theme';

type BottomTabParamsList = {
  HomeTab: undefined;
  ChatTab: undefined;
  MapTab: undefined;
  EventTab: undefined;
};

export type BottomTabProps = BottomTabScreenProps<
  BottomTabParamsList,
  'HomeTab',
  'BottomTab'
>;

const Tab = createBottomTabNavigator<BottomTabParamsList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        header: (props: BottomTabHeaderProps) => {
          return undefined;
          //return <AppTabNavigationBar {...props} />
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'ios-information-circle';
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'MapTab') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'EventTab') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: APP_THEME.colors.accent,
        tabBarInactiveTintColor: APP_THEME.colors.disabled,
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          title: 'Chat',
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapStack}
        options={{
          title: 'Map',
        }}
      />
      <Tab.Screen
        name="EventTab"
        component={EventStack}
        options={{
          title: 'Event',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
