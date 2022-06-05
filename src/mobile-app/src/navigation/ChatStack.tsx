import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import ConversationScreen from '../screens/ChatScreen/ConversationScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';

type ChatStackParamsList = {
  ConversationScreen: undefined;
  ChatScreen: undefined;
};

export type ChatStackProps = NativeStackScreenProps<
  ChatStackParamsList,
  'ConversationScreen',
  'ChatStack'
>;

const Stack = createNativeStackNavigator<ChatStackParamsList>();

const ChatStack = () => {
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
