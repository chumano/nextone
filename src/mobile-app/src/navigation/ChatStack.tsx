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
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConversationType } from '../types/Conversation/ConversationType.type';
import MembersScreen from '../screens/ChatScreen/MembersScreen';
import { useDispatch } from 'react-redux';
import { callActions } from '../stores/call/callReducer';
import FindUsersScreen from '../screens/ChatScreen/ModalCreateConversation';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import { EventInfo } from '../types/Event/EventInfo.type';

type ChatStackParamsList = {
  ConversationScreen: undefined;
  ChatScreen: {
    conversationId: string;
    name: string;
    conversationType: ConversationType
  };
  MembersScreen: undefined;
  FindUsersScreen: undefined;
  
  ChatEventDetailScreen: {
    eventInfo: EventInfo;
  };
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

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const isRenderBottomTab = routeName !== 'ChatScreen' &&  routeName !== 'FindUsersScreen';

    navigation.setOptions({
      tabBarStyle: {
        display: isRenderBottomTab ? 'flex' : 'none',
      },
    });
  }, [navigation, route]);

  return (
    <>
    <Stack.Navigator initialRouteName="ConversationScreen">
      <Stack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
        options={({ route, navigation }) => {
          return {
            title: 'Tin nh???n',
            headerRight: ()=>{
              return <>
                <TouchableOpacity onPress={()=>{
                  navigation.navigate('FindUsersScreen')
                }}>
                  <MaterialCommunityIcon name='chat-plus-outline' size={32} color={'#000'} />
                </TouchableOpacity>
              </>
            }
          }
        }}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen}
        options={({ route, navigation }) => {
          console.log('[ChatScreen]route.params', route.params);
          const { conversationId, name, conversationType } = route.params;
          return {
            title: name,
            headerRight: ( ) => {
              return <>
                {conversationType === ConversationType.Peer2Peer &&
                  <>
                    <TouchableOpacity onPress={()=>{
                      dispatch(callActions.call({
                        callInfo: {
                          type: 'call',
                          senderId: '',
                          senderName: name,
                          conversationId: conversationId,
                          callType: 'voice'
                        }
                      }));
                    }}>
                      <AwesomeIcon name='phone' size={32} color={'#000'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={()=>{
                      dispatch(callActions.call({
                        callInfo: {
                          type: 'call',
                          senderId: '',
                          senderName: name,
                          conversationId: conversationId,
                          callType: 'video'
                        }
                      }));
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
          name="FindUsersScreen"
          component={FindUsersScreen}
          options={{
            title: 'T??m ng?????i d??ng'
          }}
        />

        <Stack.Screen
          name="MembersScreen"
          component={MembersScreen}
          options={{
            title: 'Th??nh vi??n',
          }}
        />

        <Stack.Screen name="ChatEventDetailScreen" 
        component={EventDetailScreen} 
          options={{
            title: 'Th??ng tin s??? ki???n',
          }} />
    </Stack.Navigator>

    <Portal>
      
    </Portal>
    </>
    
  );
};

export default ChatStack;
