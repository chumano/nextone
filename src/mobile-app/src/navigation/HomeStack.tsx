import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  HomeScreen,
  ProfileScreen,
  DetailsScreen,
  ChangePasswordScreen,
} from '../screens/HomeScreen';
import {AppStackNavigationBar} from './AppNavigationBars';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import { ConversationType } from '../types/Conversation/ConversationType.type';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { callActions } from '../stores/call/callReducer';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';

type HomeStackParamsList = {
  HomeScreen: undefined;
  ProfileScreen: undefined;
  DetailsScreen: undefined;
  ChangePasswordScreen: undefined;
  
  ChatScreen: {
    conversationId: string;
    name: string;
    conversationType: ConversationType;
  };
};

export type HomeStackProps = NativeStackScreenProps<
  HomeStackParamsList,
  'HomeScreen',
  'HomeStack'
>;

export type DetailsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamsList,
  'DetailsScreen'
>;

const Stack = createNativeStackNavigator<HomeStackParamsList>();

const HomeStack = () => {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        header: (props: NativeStackHeaderProps) => {
          return <AppStackNavigationBar {...props} />;
        },
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home Page'}}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={{title: 'Details Page'}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile Page',
        }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{
          title: 'ChangePassword Page',
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
                const iconSize = 20;
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
    </Stack.Navigator>
  );
};
export default HomeStack;
