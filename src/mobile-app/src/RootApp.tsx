import React, {useEffect, useRef, useState} from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import {AppState, Linking, Platform} from 'react-native';
import {ChatData} from './stores/conversation/conversation.payloads';
import {useDispatch} from 'react-redux';
import {AppDispatch} from './stores/app.store';
import {conversationActions} from './stores/conversation';
import signalRService from './services/SignalRService';
import messaging, {firebase} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import {v4 as uuidv4} from 'uuid';
import notifee from '@notifee/react-native';
import CallService from './services/CallService';

import {callActions} from './stores/call/callReducer';
import {LOCATION, setupLocationWatch} from './utils/location.utils';
import {startSendHeartBeat, stopSendHeartBeat} from './utils/internet.utils';
import {conversationApi} from './apis';
import { notificationApi } from './apis/notificationApi';
import { CallMessageData } from './types/CallMessageData';

const registerAppWithFCM = async () => {
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
  }
};

// registerAppWithFCM();

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
  },
};

RNCallKeep.setup(options).then(accepted => {
  console.log('RNCallKeep setup: ', accepted);
});

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(`[${new Date()}] ` +'Message handled in the background!', remoteMessage);

  const message : CallMessageData = remoteMessage.data as any;
  if(message.type != 'call')
  {
    return;
  }

  let uuid = uuidv4();
  RNCallKeep.displayIncomingCall(
    uuid,
    message.senderName,
    `Có cuộc gọi đới từ ${message.senderName}`,
    'generic',
    message.callType === 'video',
    {},
  );

  CallService.storeCallInfo(uuid, message);
});

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  // await registerAppWithFCM();

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }

  return enabled;
}

async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  let hasNewToken = false;
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      hasNewToken = true;
      // user has a device token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }

  console.log('getFCMToken = ', {
    hasNewToken,
    token: fcmToken, 
    oldToken: undefined
  });
  return {
    hasNewToken,
    token: fcmToken, 
    oldToken: undefined
  };
}


const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const initNotification = async () => {
      console.log('initNotification')
      const enabled = await requestUserPermission();
      if (!enabled) {
        return;
      }

      const {token, oldToken, hasNewToken} = await getFCMToken();

      if(!token || !hasNewToken) {
        return;
      }
      const response = await notificationApi.registerToken(token, oldToken);
      console.log('registerToken: ', response)
    };

    initNotification();

    //foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(`[${new Date()}] ` +'A new FCM message arrived!', JSON.stringify(remoteMessage));
      const message : CallMessageData = remoteMessage.data as any;
      if(message.type != 'call')
      {
        return;
      }
      
      let uuid = uuidv4();
      RNCallKeep.displayIncomingCall(
        uuid,
        message.senderName,
        `Có cuộc gọi đới từ ${message.senderName}`,
        'generic',
        message.callType === 'video',
        {},
      );
      CallService.storeCallInfo(uuid, message);
    });
    return unsubscribe;
  }, []);

  const answerCall = async (data: any) => {
    console.log(`[answerCall]: `, data);
    const {callUUID} = data;
    RNCallKeep.rejectCall(callUUID); //end RNCallKeep UI

    //await Linking.openURL('ucom://');
    //Show App Call Screen
    const callInfo = CallService.getCallInfo(callUUID);
    if(callInfo){
      CallService.clearCallInfo(callUUID);
      dispatch(callActions.call({
        callInfo: callInfo
      }));
    }
    
  };

  const endCall = (data: any) => {
    console.log(`[endCall],: `, data);
    const {callUUID} = data;
  };

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      (RNCallKeep as any).removeEventListener('answerCall', answerCall);
      (RNCallKeep as any).removeEventListener('endCall', endCall);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      console.log('RootApp unmounted');
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
    };

    connect();
  }, [appStateVisible]);

  useEffect(() => {
    const subscription = signalRService.subscription(
      'chat',
      (data: ChatData) => {
        console.log('[chat]', data);
        dispatch(conversationActions.receiveChatData(data));
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setupLocationWatch(newLatLng => {
      console.log('setupLocationWatch', newLatLng);
    });
    startSendHeartBeat(async () => {
      const locationString = await AsyncStorage.getItem(LOCATION);
      console.log('startSendHeartBeat', {locationString});
      if (locationString) {
        const location: {lat: number; lon: number} = JSON.parse(locationString);
        conversationApi.updateMyStatus({
          lat: location.lat,
          lon: location.lon,
        });
      } else {
        conversationApi.updateMyStatus({});
      }
    });
    return () => {
      console.log('stopSendHeartBeat');
      stopSendHeartBeat();
    };
  }, []);

  return (
    <>
      <BottomTabNavigator />
    </>
  );
};

export default RootApp;
