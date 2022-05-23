import React from 'react'
import { createNativeStackNavigator, NativeStackHeaderProps } from "@react-navigation/native-stack";
import { HomeScreen, ProfileScreen, DetailsScreen } from '../screens/HomeScreen';
import { AppStackNavigationBar } from './AppNavigationBars';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                header: (props: NativeStackHeaderProps) => {
                    return <AppStackNavigationBar {...props}/> 
                } 
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home Page' }} />
            <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{ title: 'Details Page' }} />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile Page' }} />
        </Stack.Navigator>
    )

}
export default HomeStack;