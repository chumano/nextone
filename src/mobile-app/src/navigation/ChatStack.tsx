import React, { useEffect, useLayoutEffect } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import { BottomTabProps } from './BottomTabNavigator';

import ConversationScreen from '../screens/ChatScreen/ConversationScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import { Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { ConversationType } from '../types/Conversation/ConversationType.type';
import MembersScreen from '../screens/ChatScreen/MembersScreen';
import { useDispatch } from 'react-redux';
import { callActions } from '../stores/call/callReducer';

type ChatStackParamsList = {
  ConversationScreen: undefined;
  ChatScreen: {
    userId: string;
    conversationId: string;
    name: string;
    conversationType: ConversationType
  };
  MembersScreen: undefined
};

export type ChatStackProps = NativeStackScreenProps<
  ChatStackParamsList,
  'ConversationScreen',
  'ChatStack'
>;

export type ConversationScreenProp = NativeStackNavigationProp<
  ChatStackParamsList,
  'ConversationScreen'
>;

const Stack = createNativeStackNavigator<ChatStackParamsList>();

const ChatStack = ({ navigation, route }: BottomTabProps) => {
  const dispatch = useDispatch();
  console.log('[ChatStack]route.params', route.params);
  useEffect(() => {
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
          title: 'Tin nhắn',
        }}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen}
        options={({ route, navigation }) => {
          console.log('[ChatScreen]route.params', route.params);
          const { name, conversationType } = route.params;
          return {
            title: name,
            headerRight: ( ) => {
              return <>
                {conversationType === ConversationType.Peer2Peer &&
                  <>
                    <TouchableOpacity onPress={()=>{
                      dispatch(callActions.call('voice'));
                    }}>
                      <AwesomeIcon name='phone' size={32} color={'#000'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={()=>{
                      dispatch(callActions.call('video'));
                    }}>
                      <AwesomeIcon name='video' size={32} color={'#000'} />
                    </TouchableOpacity>
                  </>
                }
                {conversationType === ConversationType.Channel &&
                  <>
                    <TouchableOpacity onPress={()=>{
                      navigation.navigate('MembersScreen')
                    }}>
                      <AwesomeIcon name='info' size={32} color={'#000'} />
                    </TouchableOpacity>
                  </>
                }
              </>
            }

          }
        }} />
        <Stack.Screen
          name="MembersScreen"
          component={MembersScreen}
          options={{
            title: 'Thành viên',
          }}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
