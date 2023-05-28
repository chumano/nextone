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
import MembersScreen from '../screens/ChatScreen/MembersScreen';
import FindUsersScreen from '../screens/ChatScreen/ModalCreateConversation';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import {EventInfo} from '../types/Event/EventInfo.type';
import UserDetailInfoScreen from '../screens/ChatScreen/UserDetailInfoScreen';
import {APP_THEME} from '../constants/app.theme';
import {Appbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';

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
              header: props => {
                return (
                  <Appbar.Header
                    style={{
                      backgroundColor: APP_THEME.colors.primary,
                    }}>
                    {props.back && (
                      <Appbar.BackAction
                        color={APP_THEME.colors.accent}
                        onPress={() => {
                          props.navigation.goBack();
                        }}
                      />
                    )}
                    <Appbar.Content
                      title={'Tin nhắn'}
                      color={APP_THEME.colors.accent}
                      titleStyle={styles.title}
                    />

                    <Appbar.Action
                      icon={'chat-plus'}
                      color={APP_THEME.colors.accent}
                      onPress={() => navigation.navigate('FindUsersScreen')}
                    />
                  </Appbar.Header>
                );
              },
            };
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          options={{
            headerShown: false,
          }}
          component={ChatScreen}
        />
        <Stack.Screen
          name="FindUsersScreen"
          component={FindUsersScreen}
          options={{
            header: props => {
              return (
                <Appbar.Header
                  style={{
                    backgroundColor: APP_THEME.colors.primary,
                  }}>
                  {props.back && (
                    <Appbar.BackAction
                      color={APP_THEME.colors.accent}
                      onPress={() => {
                        props.navigation.goBack();
                      }}
                    />
                  )}
                  <Appbar.Content
                    title={'Tìm người dùng'}
                    color={APP_THEME.colors.accent}
                    titleStyle={styles.title}
                  />
                </Appbar.Header>
              );
            },
          }}
        />

        <Stack.Screen
          name="MembersScreen"
          component={MembersScreen}
          options={{
            header: props => {
              return (
                <Appbar.Header
                  style={{
                    backgroundColor: APP_THEME.colors.primary,
                  }}>
                  {props.back && (
                    <Appbar.BackAction
                      color={APP_THEME.colors.accent}
                      onPress={() => {
                        props.navigation.goBack();
                      }}
                    />
                  )}
                  <Appbar.Content
                    title={'Thành viên'}
                    color={APP_THEME.colors.accent}
                    titleStyle={styles.title}
                  />
                </Appbar.Header>
              );
            },
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
            header: props => {
              return (
                <Appbar.Header
                  style={{
                    backgroundColor: APP_THEME.colors.primary,
                  }}>
                  {props.back && (
                    <Appbar.BackAction
                      color={APP_THEME.colors.accent}
                      onPress={() => {
                        props.navigation.goBack();
                      }}
                    />
                  )}
                  <Appbar.Content
                    title={'Thông tin người dùng'}
                    color={APP_THEME.colors.accent}
                    titleStyle={styles.title}
                  />
                </Appbar.Header>
              );
            },
          }}
        />
      </Stack.Navigator>

      {/* <Portal></Portal> */}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

export default ChatStack;
