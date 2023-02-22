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
                        size={20}
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
            //console.log('[ChatScreen]route.params', route.params);
            const {conversationId, } = route.params;
            return {
              title: '...',
              
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
