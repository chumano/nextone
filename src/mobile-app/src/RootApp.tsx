import React, { useEffect, useRef, useState } from 'react';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AppState } from 'react-native';
import { ChatData } from './stores/conversation/conversation.payloads';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './stores/app.store';
import { conversationActions } from './stores/conversation';
import { SignalRService } from './services';


const signalRService = new SignalRService();

const RootApp = () => {
  const dispatch: AppDispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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
    if (appStateVisible === 'active') {
      signalRService.connectHub();
    } else {
      signalRService.disconnectHub();
    }
  }, [appStateVisible])

  useEffect(() => {
    signalRService.connectHub();
    return () => {
      signalRService.disconnectHub();
    }
  }, [])

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
