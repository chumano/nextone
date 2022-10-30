import React, {useEffect} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {BottomTabProps} from './BottomTabNavigator';

import ConversationScreen from '../screens/ChatScreen/ConversationScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import {ScrollView, TouchableOpacity} from 'react-native';
import {Button, Dialog, Portal} from 'react-native-paper';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ConversationType} from '../types/Conversation/ConversationType.type';
import MembersScreen from '../screens/ChatScreen/MembersScreen';
import {useDispatch} from 'react-redux';
import {callActions} from '../stores/call/callReducer';
import FindUsersScreen from '../screens/ChatScreen/ModalCreateConversation';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import {EventInfo} from '../types/Event/EventInfo.type';
import UserDetailInfoScreen from '../screens/ChatScreen/UserDetailInfoScreen';

type ChatStackParamsList = {
  ConversationScreen: undefined;
  ChatScreen: {
    conversationId: string;
    name: string;
    conversationType: ConversationType;
  };
  MembersScreen: undefined;
  FindUsersScreen: undefined;
  ChatEventDetailScreen: {
    eventInfo: EventInfo;
  };
  UserDetailInfoScreen: {
    conversationId: string;
  };
};

export type ChatStackProps = NativeStackScreenProps<
  ChatStackParamsList,
  'ConversationScreen',
  'ChatStack'
>;

export type UserDetailInfoRouteProp = RouteProp<
  ChatStackParamsList,
  'UserDetailInfoScreen'
>;

export type ConversationScreenProp = NativeStackNavigationProp<
  ChatStackParamsList,
  'ConversationScreen'
>;

const Stack = createNativeStackNavigator<ChatStackParamsList>();

const ChatStack = ({navigation, route}: BottomTabProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const isRenderBottomTab =
      routeName !== 'ChatScreen' &&
      routeName !== 'FindUsersScreen' &&
      routeName !== 'UserDetailInfoScreen' &&
      routeName !== 'MembersScreen';

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
          options={({route, navigation}) => {
            return {
              title: 'Tin nhắn',
              headerRight: () => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('FindUsersScreen');
                      }}>
                      <MaterialCommunityIcon
                        name="chat-plus-outline"
                        size={16}
                        color={'#000'}
                      />
                    </TouchableOpacity>
                  </>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({route, navigation}) => {
            console.log('[ChatScreen]route.params', route.params);
            const {conversationId, name, conversationType} = route.params;
            return {
              title: name,
              headerRight: () => {
                const iconSize = 18;
                return (
                  <>
                    {conversationType === ConversationType.Peer2Peer && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            dispatch(
                              callActions.call({
                                callInfo: {
                                  type: 'call',
                                  senderId: '',
                                  senderName: name,
                                  conversationId: conversationId,
                                  callType: 'voice',
                                },
                              }),
                            );
                          }}>
                          <AwesomeIcon name="phone" size={iconSize} color={'#000'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{marginHorizontal: 20}}
                          onPress={() => {
                            dispatch(
                              callActions.call({
                                callInfo: {
                                  type: 'call',
                                  senderId: '',
                                  senderName: name,
                                  conversationId: conversationId,
                                  callType: 'video',
                                },
                              }),
                            );
                          }}>
                          <AwesomeIcon name="video" size={iconSize} color={'#000'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('UserDetailInfoScreen', {
                              conversationId,
                            });
                          }}>
                          <AwesomeIcon name="info" size={iconSize} color={'#000'} />
                        </TouchableOpacity>
                      </>
                    )}
                    {conversationType === ConversationType.Channel && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('MembersScreen');
                          }}>
                          <AwesomeIcon name="info" size={iconSize} color={'#000'} />
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name="FindUsersScreen"
          component={FindUsersScreen}
          options={{
            title: 'Tìm người dùng',
          }}
        />

        <Stack.Screen
          name="MembersScreen"
          component={MembersScreen}
          options={{
            title: 'Thành viên',
          }}
        />

        <Stack.Screen
          name="ChatEventDetailScreen"
          component={EventDetailScreen}
          options={{
            title: 'Thông tin sự kiện',
          }}
        />

        <Stack.Screen
          name="UserDetailInfoScreen"
          component={UserDetailInfoScreen}
          options={{
            title: 'Thông tin người dùng',
            headerBackTitle: 'Trở về',
          }}
        />
      </Stack.Navigator>

      {/* <Portal></Portal> */}
    </>
  );
};

export default ChatStack;
