import React, {useLayoutEffect} from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import EventScreen from '../screens/EventScreen/EventScreen';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {BottomTabProps} from './BottomTabNavigator';

type EventStackParamsList = {
  EventScreen: undefined;
  EventDetailScreen: undefined;
};

export type EventStackProps = NativeStackNavigationProp<
  EventStackParamsList,
  'EventScreen',
  'EventStack'
>;

const Stack = createNativeStackNavigator<EventStackParamsList>();

const EventStack = ({navigation, route}: BottomTabProps) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const isRenderBottomTab = routeName !== 'EventDetailScreen';
    navigation.setOptions({
      tabBarStyle: {
        display: isRenderBottomTab ? 'flex' : 'none',
      },
    });
  }, [navigation, route]);
  return (
    <Stack.Navigator initialRouteName="EventScreen">
      <Stack.Screen
        name="EventScreen"
        component={EventScreen}
        options={{
          title: 'List Event Recently',
        }}
      />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
    </Stack.Navigator>
  );
};

export default EventStack;
