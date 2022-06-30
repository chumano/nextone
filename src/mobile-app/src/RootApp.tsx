import React, { useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState, Linking, Platform } from 'react-native';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import { SignalRService } from './services';
import messaging, { firebase } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import { v4 as uuidv4 } from 'uuid';
import notifee from '@notifee/react-native';

import { callActions } from './stores/call/callReducer';
import { LOCATION, setupLocationWatch } from './utils/location.utils';
import { startSendHeartBeat, stopSendHeartBeat } from './utils/internet.utils';
import { conversationApi } from './apis';

const options = {
  ios: {
    appName: 'My app name',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    additionalPermissions: [],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.ucom',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    }, 
  }
};

RNCallKeep.setup(options).then(accepted => {
  console.log('RNCallKeep', accepted)
});

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // notifee.displayNotification({
  //   body: 'This message was sent via FCM!',
  //   android: {
  //     channelId: 'default',
  //     actions: [
  //       {
  //         title: 'Mark as Read',
  //         pressAction: {
  //           id: 'read',
  //         },
  //       },
  //     ],
  //   },
  // });
  // return;

  let uuid = uuidv4();
  RNCallKeep.displayIncomingCall(
    uuid,
    'payload.caller_name',
    'Incoming Call from ...' ,
    'generic',
    true,
    {}
  );
});


async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  return enabled;
}

async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
  console.log('token = ', fcmToken);
}

const signalRService = new SignalRService();

const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  useEffect(() => {
    const initNotificaiton = async () => {
      const enabled = await requestUserPermission();
      if (enabled) {
        await getFCMToken();
      }
    }

    initNotificaiton();
    //foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      notifee.displayNotification({
        body: 'This message was sent via FCM!',
        android: {
          channelId: 'default',
          actions: [
            {
              title: 'Mark as Read',
              pressAction: {
                id: 'read',
              },
            },
          ],
        },
      });
      return;
      let uuid = uuidv4();
      RNCallKeep.displayIncomingCall(
        uuid,
        'payload.caller_name',
        'Incoming Call from ...',
        'generic',
        true,
        {}
      );
    });
    return unsubscribe;

  }, [])

  const answerCall = async (data: any) => {
    console.log(`[answerCall]: `, data);
    const {callUUID} = data;
    RNCallKeep.rejectCall(callUUID); //end RNCallKeep UI

    await Linking.openURL('ucom://')
    //Show App Call Screen
    dispatch(callActions.call('voice'));
    // setTimeout(() => {
    //   RNCallKeep.setCurrentCallActive(callUUID);
    // }, 1000);
  };

  const endCall = (data: any) => {
    console.log(`[endCall],: `, data);
    const {callUUID} = data;
  };

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener('endCall', endCall);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      console.log("RootApp unmounted")
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (appStateVisible === 'active') {
        await signalRService.connectHub();
      } else {
        await signalRService.disconnectHub();
      }
    }

    connect();
  }, [appStateVisible])

  useEffect(() => {
    const subscription = signalRService.subscription("chat", (data: ChatData) => {
      console.log('[chat]', data)
      dispatch(conversationActions.receiveChatData(data))
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  useEffect(() => {
    setupLocationWatch((newLatLng) => {
      console.log('setupLocationWatch', newLatLng)
    });
    startSendHeartBeat(async ()=>{
      const locationString = await AsyncStorage.getItem(LOCATION);
      console.log('startSendHeartBeat', {locationString})
      if (locationString) {
        const location: { lat: number; lon: number } = JSON.parse( locationString  );
        conversationApi.updateMyStatus({
            lat: location.lat,
            lon: location.lon
        })
      } else{
        conversationApi.updateMyStatus({})
      }
    });
    return ()=>{
      console.log('stopSendHeartBeat')
      stopSendHeartBeat();
    }
  }, []);
  
  return (
    <>
      <BottomTabNavigator />
    </>
  );
};

export default RootApp;
