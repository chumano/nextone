import React, { useContext, useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState, Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import messaging, {firebase} from '@react-native-firebase/messaging';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, IAppStore } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import signalRService from './services/SignalRService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCallKeep from 'react-native-callkeep';
import { CallSignalingEvents } from './services/CallService';

import { LOCATION, setupLocationWatch } from './utils/location.utils';
import { startSendHeartBeat, stopSendHeartBeat } from './utils/internet.utils';
import { conversationApi } from './apis';
import { notificationApi } from './apis/notificationApi';
import { CallMessageData, ChatMessageData, IMessageData } from './types/CallMessageData';
import { CallScreen } from './screens/CallScreen/CallScreen';
import { getFCMToken, registerFBForegroundHandler, requestFBUserPermission } from './utils/fcm';
import { callKeepOptions, displayCallRequest, answerCall, endCall, CALL_WAIT_TIME } from './utils/callUtils';
import { GlobalContext } from '../AppContext';
import { IApplicationSettings } from './types/AppConfig.type';
import { useNavigation } from '@react-navigation/native';
import { ConversationScreenProp } from './navigation/ChatStack';
import { ConversationType } from './types/Conversation/ConversationType.type';


//CHANGE_ME
const useSocketToListenCall = false; //local=true

const RootApp = () => {
  const { isCalling } = useSelector((store: IAppStore) => store.call);

  const globalData = useContext(GlobalContext);
  const {applicationSettings} = globalData;
  
  useCallKeep();
  useFirebaseListen(applicationSettings!);
  useSignalRListen(applicationSettings!);

  useLocationWatch(applicationSettings!);

  const isShowCallScreen = isCalling;
  return (
    <>
      <BottomTabNavigator />

      {isShowCallScreen && applicationSettings && <CallScreen />}
    </>
  );
};

export default RootApp;

const useFirebaseListen = (applicationSettings?: IApplicationSettings) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ConversationScreenProp>();
  //use firebase to receive call request
  useEffect(() => {
    const initNotification = async () => {
      //console.log('requestFBUserPermission')
      const enabled = await requestFBUserPermission();
      if (!enabled) {
        return;
      }

      const { token, oldToken, hasNewToken } = await getFCMToken();
      //console.log('FCMToken: ', token)
      if (!token) {
        return;
      }
      const response = await notificationApi.registerToken(token, oldToken);
      //console.log('registerToken: ', response)
    };

    initNotification();

  }, []);

  useEffect(() => {
    if(!applicationSettings) return;
    const unsubscribe = registerFBForegroundHandler(async (remoteMessage: any) => {
      //console.log(`[${new Date()}] ` + 'handleFBCall', remoteMessage);
      const message: IMessageData = remoteMessage.data as any;
      if(message.type==='call'){
        const callMessage= message as CallMessageData;
        displayCallRequest(callMessage,applicationSettings.callTimeOutInSeconds*1000 || CALL_WAIT_TIME);
      }else if(message.type==='message'){
        console.log("have message data", message as ChatMessageData)
      }
      
    });
    return unsubscribe;
  }, [applicationSettings])

  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open
  //   console.log('aaaaaaaaaaaaaaa')
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage,
  //     );

  //     const message: ChatMessageData = remoteMessage.data as any;
  //     if(message.type==='message'){
  //       const conversationId = message.conversationId;
  //       dispatch(conversationActions.selectConversation(conversationId));
  //       navigation.navigate('ChatScreen', {
  //         conversationId: conversationId,
  //         name: 'conversationId',
  //         conversationType: ConversationType.Peer2Peer
  //       });
  //     }
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit state:',
  //           remoteMessage,
  //         );
  //       }
        
  //     });
  // }, []);
}

const useCallKeep = () => {
  useEffect(() => {
    RNCallKeep.setup(callKeepOptions).then(accepted => {
      //console.log('RNCallKeep setup: ', accepted);
    });

  }, [])

  useEffect(() => {
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('endCall', endCall);

    return () => {
      (RNCallKeep as any).removeEventListener('answerCall', answerCall);
      (RNCallKeep as any).removeEventListener('endCall', endCall);
    }
  }, []);
}

const useSignalRListen = (applicationSettings?: IApplicationSettings) => {
  const dispatch: AppDispatch = useDispatch();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
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

  //use websocket to receive call request
  useEffect(() => {
    if (!useSocketToListenCall || !applicationSettings) return;
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
      displayCallRequest(callMessage, applicationSettings.callTimeOutInSeconds*1000 || CALL_WAIT_TIME);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [applicationSettings]);

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

}

const useLocationWatch = (applicationSettings?: IApplicationSettings) => {
  //update location heart beat
  useEffect(() => {
    setupLocationWatch(newLatLng => {
      //console.log(new Date()+' setupLocationWatch', newLatLng);
    });
  },[]);

  useEffect(() => {
    if(!applicationSettings) return;
    const intervalInSeconds = applicationSettings.updateLocationHeartbeatInSeconds || 60;
    
    startSendHeartBeat(intervalInSeconds, async () => {
      try {
        const locationString = await AsyncStorage.getItem(LOCATION);
        //console.log( new Date()+` startSendHeartBeat [${intervalInSeconds}]`, { locationString });
        if (locationString) {
          const location: { lat: number; lon: number } = JSON.parse(locationString);
          if (location?.lat && location?.lon) {
            conversationApi.updateMyStatus({
              lat: location.lat,
              lon: location.lon,
            });
          }
        } else {
          conversationApi.updateMyStatus({});
        }
      } catch (err) {
        console.error('startSendHeartBeat', err);
      }
    });
    return () => {
      //console.log('stopSendHeartBeat');
      stopSendHeartBeat();
    };
  }, [applicationSettings]);
}