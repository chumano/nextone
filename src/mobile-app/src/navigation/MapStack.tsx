import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import MapScreen from '../screens/MapScreen/MapScreen';
import { EventInfo } from '../types/Event/EventInfo.type';
import { AppStackNavigationBar } from './AppNavigationBars';

type MapStackParamsList = {
  Map: {
    position?: [number, number]
  } | undefined;
  EventDetailScreen: {
    eventInfo: EventInfo;
  };
};

export type MapStackProps = NativeStackScreenProps<
  MapStackParamsList
>;

export type MapScreenProp = NativeStackNavigationProp<
  MapStackParamsList
>;

const Stack = createNativeStackNavigator<MapStackParamsList>();
const MapStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Map"
      screenOptions={{
        //headerShown: 
        // header: (props: NativeStackHeaderProps) => {
        //   if(props.route.name === "Map"){
        //     return undefined;
        //   }
          
          
        // },
      }}>
      <Stack.Screen name="Map" component={MapScreen} options={{title: 'Map', headerShown:false}} />
   
      <Stack.Screen name="EventDetailScreen" 
        component={EventDetailScreen} 
          options={{
            title: 'Thông tin sự kiện',
          }} />
    </Stack.Navigator>
  );
};

export default MapStack;
