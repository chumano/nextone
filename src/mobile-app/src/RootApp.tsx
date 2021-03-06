import React, {useEffect, useRef, useState} from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import {AppState, Linking, Platform} from 'react-native';
import {ChatData} from './stores/conversation/conversation.payloads';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from './stores/app.store';
import {conversationActions} from './stores/conversation';
import signalRService from './services/SignalRService';
import messaging, {firebase} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import {v4 as uuidv4} from 'uuid';
import notifee from '@notifee/react-native';
import CallService, { CallSignalingActions } from './services/CallService';

import {callActions} from './stores/call/callReducer';
import {LOCATION, setupLocationWatch} from './utils/location.utils';
import {startSendHeartBeat, stopSendHeartBeat} from './utils/internet.utils';
import {conversationApi} from './apis';
import { notificationApi } from './apis/notificationApi';
import { CallMessageData } from './types/CallMessageData';
import { CallScreen } from './screens/CallScreen/CallScreen';

const registerAppWithFCM = async () => {
  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
    await messaging().setAutoInitEnabled(true);
  }
};

// registerAppWithFCM();

const options = {
  ios: {
    appName: 'UCOM',
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
      channelName: 'Foreground service for UCOM',
      notificationTitle: 'UCOM is running on background',
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
    `C?? cu???c g???i t??? ${message.senderName}`,
    'generic',
    message.callType === 'video',
    {},
  );

  if(CallService.isCalling){
    setTimeout(()=>{
      RNCallKeep.reportEndCallWithUUID(uuid, 6);
    },1000)
    return;
  }

  CallService.storeCallInfo(uuid, message);

  setTimeout(() => {
    if (CallService.isRinging) {
      CallService.clearCallInfo(uuid)
      // 6 = MissedCall
      // https://github.com/react-native-webrtc/react-native-callkeep#constants
      RNCallKeep.reportEndCallWithUUID(uuid, 6);
    }
  }, 15000);
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
  const {isCalling} = useSelector((store: IAppStore) => store.call);

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
        `C?? cu???c g???i t??? ${message.senderName}`,
        'generic',
        message.callType === 'video',
        {},
      );

      if(CallService.isCalling){
        setTimeout(()=>{
          RNCallKeep.reportEndCallWithUUID(uuid, 6);
        },1000)
        return;
      }

      CallService.storeCallInfo(uuid, message);

      setTimeout(() => {
        if (CallService.isRinging) {
          CallService.clearCallInfo(uuid)
          // 6 = MissedCall
          // https://github.com/react-native-webrtc/react-native-callkeep#constants
          RNCallKeep.reportEndCallWithUUID(uuid, 6);
        }
      }, 15000);
    });
    return unsubscribe;
  }, []);

  const answerCall = async (data: any) => {
    try{
      console.log(`[answerCall]: `, data);
      const {callUUID} = data;
      RNCallKeep.rejectCall(callUUID); //end RNCallKeep UI

      //await Linking.openURL('ucom://');
      //Show App Call Screen
      RNCallKeep.backToForeground();

      //TODO: if in locked , open key board to unlock phone
      const callInfo = CallService.getCallInfo(callUUID);
      if(callInfo){
        CallService.clearCallInfo(callUUID);
        dispatch(callActions.call({
          callInfo: callInfo
        }));
      }
    }catch(err){
      console.error(`[answerCall]: `, err);
    }
    
  };

  const endCall = async (data: any) => {
    console.log(`[endCall],: `, data);
    const {callUUID} = data;
    const callInfo = CallService.getCallInfo(callUUID);
    if(callInfo){
    await signalRService.invoke(
        CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
        {
          room: callInfo.conversationId,
          accepted: false
        }
      );
    }
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

  const isShowCallScreen = isCalling;
  return (
    <>
      <BottomTabNavigator />
      
      {isShowCallScreen && <CallScreen />}
    </>
  );
};

export default RootApp;
