import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import MapScreen from '../screens/MapScreen/MapScreen';

type MapStackParamsList = {
  Map: {
    position?: [number, number]
  } | undefined;
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
        header: (props: NativeStackHeaderProps) => {
          return undefined;
        },
      }}>
      <Stack.Screen name="Map" component={MapScreen} options={{title: 'Map'}} />
    </Stack.Navigator>
  );
};

export default MapStack;
