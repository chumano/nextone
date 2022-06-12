import React, {useLayoutEffect} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {BottomTabProps} from './BottomTabNavigator';

import ConversationScreen from '../screens/ChatScreen/ConversationScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';


type ChatStackParamsList = {
  ConversationScreen: undefined;
  ChatScreen: undefined;
};

export type ChatStackProps = NativeStackNavigationProp<
  ChatStackParamsList,
  'ConversationScreen',
  'ChatStack'
>;

const Stack = createNativeStackNavigator<ChatStackParamsList>();

const ChatStack = ({navigation, route}: BottomTabProps) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const isRenderBottomTab = routeName !== 'ChatScreen';
    navigation.setOptions({
      tabBarStyle: {
        display: isRenderBottomTab ? 'flex' : 'none',
      },
    });
  }, [navigation, route]);
  return (
    <Stack.Navigator initialRouteName="ConversationScreen">
      <Stack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={{
          title: 'ConversationScreen',
        }}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ChatStack;
