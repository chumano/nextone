import React, {useLayoutEffect} from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import EventScreen from '../screens/EventScreen/EventScreen';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import SendEventScreen from '../screens/EventScreen/SendEventScreen';

import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {BottomTabProps} from './BottomTabNavigator';
import {IconButton} from 'react-native-paper';

import {EventInfo} from '../types/Event/EventInfo.type';

type EventStackParamsList = {
  EventScreen: undefined;
  EventDetailScreen: {
    eventInfo: EventInfo;
  };
  SendEventScreen: undefined;
};

export type EventStackProps = NativeStackNavigationProp<
  EventStackParamsList,
  'EventScreen',
  'EventStack'
>;

export type EventDetailRouteProp = RouteProp<
  EventStackParamsList,
  'EventDetailScreen'
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
        options={({navigation}) => {
          const onNavigateHandler = () => {
            navigation.navigate('SendEventScreen');
          };

          return {
            title: 'List Event By Me',
            headerRight: _ => {
              return <IconButton icon="plus" onPress={onNavigateHandler} />;
            },
          };
        }}
      />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="SendEventScreen" component={SendEventScreen} />
    </Stack.Navigator>
  );
};

export default EventStack;
