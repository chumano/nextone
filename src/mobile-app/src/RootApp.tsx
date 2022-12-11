import React, { useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState, Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IAppStore, appStore } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import signalRService from './services/SignalRService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import CallService, { CallSignalingActions, CallSignalingEvents } from './services/CallService';

import { callActions } from './stores/call/callReducer';
import { LOCATION, setupLocationWatch } from './utils/location.utils';
import { startSendHeartBeat, stopSendHeartBeat } from './utils/internet.utils';
import { conversationApi } from './apis';
import { notificationApi } from './apis/notificationApi';
import { CallMessageData } from './types/CallMessageData';
import { CallScreen } from './screens/CallScreen/CallScreen';
import { getFCMToken, registerFBForegroundHandler, requestFBUserPermission } from './utils/fcm';
import { callKeepOptions, displayCallRequest, answerCall, endCall } from './utils/callUtils';


const handleFBCall = async (remoteMessage: any) => {
  //console.log(`[${new Date()}] ` + 'handleFBCall', remoteMessage);
  const message: CallMessageData = remoteMessage.data as any;
  displayCallRequest(message);
}

//CHANGE_ME
const useSocketToListenCall = true; //local=true

const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { isCalling } = useSelector((store: IAppStore) => store.call);

  useEffect(()=>{
    RNCallKeep.setup(callKeepOptions).then(accepted => {
      //console.log('RNCallKeep setup: ', accepted);
    });
    
  },[])
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
    const initNotification = async () => {
      //console.log('requestFBUserPermission')
      const enabled = await requestFBUserPermission();
      if (!enabled) {
        return;
      }

      const { token, oldToken, hasNewToken } = await getFCMToken();
      console.log('FCMToken: ', token)
      if (!token ) {
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
    if(!useSocketToListenCall) return;
    const subscription = signalRService.subscription( CallSignalingEvents.CALL_REQUEST, (msg: any) => {
        //TODO: receive call-request , wait user accept
        //console.log("receiving a call...", msg)
        //{"callType": "video", "room": "7934dba7-1a97-4cfd-a161-7baa23e90e09", "userId": "05d5ce08-6a51-4c90-9f73-163e2bb136ee", "userName": "manager"}
        const callMessage: CallMessageData = {
          type : 'call',
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
    const subscription = signalRService.subscription( 'chat', (data: ChatData) => {
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