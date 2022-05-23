import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react'
import { Text } from 'react-native-paper'
import MapScreen from '../screens/MapScreen/MapScreen';

const Stack = createNativeStackNavigator();
const MapStack = () => {
  return (
    <Stack.Navigator
            initialRouteName="Map"
            screenOptions={{
                header: (props: NativeStackHeaderProps) => {
                    return undefined;
                } 
            }}
        >
            <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{ title: 'Map' }} />
        </Stack.Navigator>
  )
}

export default MapStack