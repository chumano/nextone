import React, { useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState, Linking, Platform } from 'react-native';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IAppStore } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import signalRService from './services/SignalRService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import { v4 as uuidv4 } from 'uuid';
import CallService, { CallSignalingActions, CallSignalingEvents } from './services/CallService';

import { callActions } from './stores/call/callReducer';
import { LOCATION, setupLocationWatch } from './utils/location.utils';
import { startSendHeartBeat, stopSendHeartBeat } from './utils/internet.utils';
import { conversationApi } from './apis';
import { notificationApi } from './apis/notificationApi';
import { CallMessageData } from './types/CallMessageData';
import { CallScreen } from './screens/CallScreen/CallScreen';
import { getFCMToken, registerFBForegroundHandler, requestFBUserPermission } from './utils/fcm';
import messaging, { firebase } from '@react-native-firebase/messaging';
import VIForegroundService from "@voximplant/react-native-foreground-service";

//CHANGE_ME
const useSocketToListenCall = true;

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

//===================================================
const displayCallRequest = async (message: CallMessageData) => {
  //console.log('displayCallRequest', message)
  if (message.type != 'call') {
    return;
  }

  let uuid = uuidv4();
  RNCallKeep.displayIncomingCall(
    uuid,
    message.senderName,
    `Có cuộc gọi từ ${message.senderName}`,
    'generic',
    message.callType === 'video',
    {},
  );

  if (CallService.isCalling) {
    setTimeout(() => {
      RNCallKeep.reportEndCallWithUUID(uuid, 6);
    }, 1000)
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
}

const handleFBCall = async (remoteMessage: any) => {
  const message: CallMessageData = remoteMessage.data as any;
  displayCallRequest(message);
}

if (!useSocketToListenCall) {
  //firebase background
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //console.log(`[${new Date()}] ` + 'Message handled in the background!', remoteMessage);
    const message: CallMessageData = remoteMessage.data as any;

    displayCallRequest(message);
  });
}

const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { isCalling } = useSelector((store: IAppStore) => store.call);

  useForegroundService();
  useEffect(() => {
    RNCallKeep.setup(options).then(accepted => {
      //console.log('RNCallKeep setup: ', accepted);
    });

  }, [])
  //app state
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        //console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      //console.log('AppState', appState.current);
    });

    return () => {
      //console.log('RootApp unmounted');
      subscription.remove();
    };
  }, []);

  //=======================================================
  //use firebase to receive call request
  useEffect(() => {
    if (useSocketToListenCall) return;

    const initNotification = async () => {
      //console.log('requestFBUserPermission')
      const enabled = await requestFBUserPermission();
      if (!enabled) {
        return;
      }

      const { token, oldToken, hasNewToken } = await getFCMToken();

      if (!token) {
        return;
      }
      const response = await notificationApi.registerToken(token, oldToken);
      //console.log('registerToken: ', response)
    };

    initNotification();

    const unsubscribe = registerFBForegroundHandler(handleFBCall);
    return unsubscribe;
  }, []);

  //use websocket to receive call request
  useEffect(() => {
    if (!useSocketToListenCall) return;
    const subscription = signalRService.subscription(CallSignalingEvents.CALL_REQUEST, (msg: any) => {
      //TODO: receive call-request , wait user accept
      //console.log("receiving a call...", msg)
      //{"callType": "video", "room": "7934dba7-1a97-4cfd-a161-7baa23e90e09", "userId": "05d5ce08-6a51-4c90-9f73-163e2bb136ee", "userName": "manager"}
      const callMessage: CallMessageData = {
        type: 'call',
        callType: msg.callType,
        conversationId: msg.room,
        senderId: msg.userId,
        senderName: msg.userName,
      }
      displayCallRequest(callMessage);
    },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  //=======================================================

  const answerCall = async (data: any) => {
    try {
      //console.log(`[answerCall]: `, data);
      const { callUUID } = data;
      RNCallKeep.rejectCall(callUUID); //end RNCallKeep UI

      //await Linking.openURL('ucom://');
      //Show App Call Screen
      RNCallKeep.backToForeground();

      //TODO: if in locked , open key board to unlock phone
      const callInfo = CallService.getCallInfo(callUUID);
      if (callInfo) {
        CallService.clearCallInfo(callUUID);
        dispatch(callActions.call({
          callInfo: callInfo
        }));
      }
    } catch (err) {
      console.error(`[answerCall]: `, err);
    }

  };

  const endCall = async (data: any) => {
    //console.log(`[endCall],: `, data);
    const { callUUID } = data;
    const callInfo = CallService.getCallInfo(callUUID);
    if (callInfo) {
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

  //handle signalR reconnect
  useEffect(() => {
    const connect = async () => {
      if (appStateVisible === 'active') {
        await signalRService.connectHub();
      }
      // else {
      //   await signalRService.disconnectHub();
      // }
    };

    connect();
  }, [appStateVisible]);

  useEffect(() => {
    const subscription = signalRService.subscription('chat', (data: ChatData) => {
      //console.log('[chat]', data);
      dispatch(conversationActions.receiveChatData(data));
    },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, []);


  //update location heart beat
  useEffect(() => {
    setupLocationWatch(newLatLng => {
      //console.log('setupLocationWatch', newLatLng);
    });
    startSendHeartBeat(async () => {
      const locationString = await AsyncStorage.getItem(LOCATION);
      //console.log('startSendHeartBeat', { locationString });
      if (locationString) {
        const location: { lat: number; lon: number } = JSON.parse(locationString);
        conversationApi.updateMyStatus({
          lat: location.lat,
          lon: location.lon,
        });
      } else {
        conversationApi.updateMyStatus({});
      }
    });
    return () => {
      //console.log('stopSendHeartBeat');
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


const foregroundService = VIForegroundService.getInstance();
const useForegroundService = () => {
  const [isRunningService, setIsRunningService] = useState(false)

  const stopService = async ()=>{
    if (!isRunningService) return;
    setIsRunningService(false);
    await foregroundService.stopService();
    foregroundService.off();
  }

  const subscribeForegroundButtonPressedEvent = ()=> {
    foregroundService.on('VIForegroundServiceButtonPressed', async () => {
      await stopService();
    });
  }

  const startService = async () =>{
    if (Platform.OS !== 'android') {
      console.log('Only Android platform is supported');
      return;
    }
    if (isRunningService) return;
    if (Platform.Version >= 26) {
      const channelConfig = {
        id: 'ForegroundServiceChannel',
        name: 'Notification Channel',
        description: 'Notification Channel for Foreground Service',
        enableVibration: false,
        importance: 2
      };
      await foregroundService.createNotificationChannel(channelConfig);
    }
    const notificationConfig = {
      channelId: 'ForegroundServiceChannel',
      id: 3456,
      title: 'Foreground Service',
      text: 'Foreground service is running',
      icon: 'ic_notification',
      priority: 0,
      button: 'Stop service'
    };
    try {
      subscribeForegroundButtonPressedEvent();
      await foregroundService.startService(notificationConfig);
      setIsRunningService(true);
    } catch (_) {
      foregroundService.off();
    }
  }

  useEffect(()=>{
    startService();
  },[])
}