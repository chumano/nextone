import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, BottomNavigation, Text } from 'react-native-paper';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventStack from './EventStack';
import MapStack from './MapStack';
import ChatStack from './ChatStack';
import HomeStack from './HomeStack';
import { BottomTabBarButtonProps, BottomTabHeaderProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppTabNavigationBar } from './AppNavigationBars';

const styles = StyleSheet.create({
    title: {
        margin: 10,
        fontSize: 15,
        textAlign: 'center'
    }
});


const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {

    return <Tab.Navigator
        screenOptions={({ route }) => ({
            header: (props: BottomTabHeaderProps) => {
                return undefined;
                //return <AppTabNavigationBar {...props} />
            },
            tabBarIcon: ({ focused, color, size }) => {
                let iconName = 'ios-information-circle';
                if (route.name === 'Home') {
                    iconName = focused
                        ? 'home'
                        : 'home-outline';
                } else if (route.name === 'Chat') {
                    iconName = focused
                        ? 'chatbox'
                        : 'chatbox-outline';
                } else if (route.name === 'Map') {
                    iconName = focused
                        ? 'map'
                        : 'map-outline';
                } else if (route.name === 'Event') {
                    iconName = focused
                        ? 'list-circle'
                        : 'list-circle-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Chat" component={ChatStack} />
        <Tab.Screen name="Map" component={MapStack} />
        <Tab.Screen name="Event" component={EventStack} />
    </Tab.Navigator>
}

export default BottomTabNavigator