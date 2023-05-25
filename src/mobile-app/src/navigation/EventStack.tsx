import React, {useLayoutEffect} from 'react';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import EventScreen from '../screens/EventScreen/EventScreen';
import EventDetailScreen from '../screens/EventScreen/EventDetailScreen';
import SendEventScreen from '../screens/EventScreen/SendEventScreen';

import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import {BottomTabProps} from './BottomTabNavigator';
import {Appbar} from 'react-native-paper';

import {EventInfo} from '../types/Event/EventInfo.type';
import EventTypePickScreen from '../screens/EventScreen/EventTypePickScreen';
import {APP_THEME} from '../constants/app.theme';
import {StyleSheet} from 'react-native';

type EventStackParamsList = {
  EventScreen: {
    reload?: boolean;
  };
  EventDetailScreen: {
    eventInfo: EventInfo;
  };

  EventTypePickScreen: undefined;
  SendEventScreen: {
    eventType: any;
  };
};

export type EventStackProps = NativeStackNavigationProp<
  EventStackParamsList,
  'EventScreen',
  'EventStack'
>;

export type EventDetailRouteProp = RouteProp<
  EventStackParamsList,
  'EventDetailScreen'
>;

export type EventSendRouteProp = RouteProp<
  EventStackParamsList,
  'SendEventScreen'
>;

export type EventsRouteProp = RouteProp<EventStackParamsList, 'EventScreen'>;

const Stack = createNativeStackNavigator<EventStackParamsList>();

const EventStack = ({navigation, route}: BottomTabProps) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const isRenderBottomTab = routeName !== 'EventDetailScreen';
    navigation.setOptions({
      tabBarStyle: {
        display: isRenderBottomTab ? 'flex' : 'none',
      },
    });
  }, [navigation, route]);

  return (
    <Stack.Navigator initialRouteName="EventScreen">
      <Stack.Screen
        name="EventScreen"
        component={EventScreen}
        options={({navigation}) => {
          const onNavigateHandler = () => {
            navigation.navigate('EventTypePickScreen');
          };

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
                    title={'Sự kiện'}
                    color={APP_THEME.colors.accent}
                    titleStyle={styles.title}
                  />

                  <Appbar.Action
                    icon={'plus'}
                    color={APP_THEME.colors.accent}
                    onPress={onNavigateHandler}
                  />
                </Appbar.Header>
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="EventDetailScreen"
        component={EventDetailScreen}
        options={{
          title: 'Thông tin sự kiện',
        }}
      />

      <Stack.Screen
        name="EventTypePickScreen"
        component={EventTypePickScreen}
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
                  title={'Gửi sự kiện'}
                  color={APP_THEME.colors.accent}
                  titleStyle={styles.title}
                />
              </Appbar.Header>
            );
          },
        }}
      />
      <Stack.Screen
        name="SendEventScreen"
        component={SendEventScreen}
        options={{
          title: 'Gửi sự kiện',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
});

export default EventStack;
