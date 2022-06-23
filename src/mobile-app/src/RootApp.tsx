import React, { useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState } from 'react-native';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import { SignalRService } from './services';
import messaging, { firebase } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
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
    console.log('token = ', fcmToken);
    if (fcmToken) {
      // user has a device token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  }
}

const signalRService = new SignalRService();

const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  
  useEffect(()=>{
    const initNotificaiton = async ()=>{
      const enabled = await requestUserPermission();
      if(enabled){
        await getFCMToken();
      }

     
    }

    initNotificaiton();
    //foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;

  },[])
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
    const connect = async ()=>{
      if (appStateVisible === 'active') {
        await signalRService.connectHub();
      } else {
        await signalRService.disconnectHub();
      }
    }

    connect();
  }, [appStateVisible])

  useEffect(() => {
    const subscription = signalRService.subscription("chat", (data: ChatData)=>{
      console.log('[chat]', data)
      dispatch(conversationActions.receiveChatData(data))
    });
    return () => {
      subscription.unsubscribe();
    }
  }, [])

  return (
    <>
      <BottomTabNavigator />
    </>
  );
};

export default RootApp;
