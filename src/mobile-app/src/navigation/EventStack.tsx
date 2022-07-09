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
import EventTypePickScreen from '../screens/EventScreen/EventTypePickScreen';

type EventStackParamsList = {
  EventScreen: {
    reload? : boolean
  };
  EventDetailScreen: {
    eventInfo: EventInfo;
  };

  EventTypePickScreen: undefined;
  SendEventScreen: {
    eventType: any
  };
  
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

export type EventSendRouteProp = RouteProp<
  EventStackParamsList,
  'SendEventScreen'
>;

export type EventsRouteProp = RouteProp<
  EventStackParamsList,
  'EventScreen'
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
            navigation.navigate('EventTypePickScreen');
          };

          return {
            title: 'Sự kiện',
            headerRight: _ => {
              return <IconButton icon="plus" onPress={onNavigateHandler} />;
            },
          };
        }}
      />
      <Stack.Screen name="EventDetailScreen" 
        component={EventDetailScreen} 
          options={{
            title: 'Thông tin sự kiện',
          }} />

      <Stack.Screen name="EventTypePickScreen"
         component={EventTypePickScreen} 
         
         options={{
          title: 'Gửi sự kiện',
        }}/>
      <Stack.Screen name="SendEventScreen"
         component={SendEventScreen} 
         
         options={{
          title: 'Gửi sự kiện',
        }}/>
    </Stack.Navigator>
  );
};

export default EventStack;
