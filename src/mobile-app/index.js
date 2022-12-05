/**
 * @format
 */

import { AppRegistry, AppState, Linking, NativeModules, Platform } from 'react-native';
import 'react-native-get-random-values'
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
const { UcomNative } = NativeModules;
import {displayCallRequest} from './src/utils/callUtils'

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    console.log('RNCallKeepBackgroundMessage', { name, callUUID, handle })
    Linking.openURL(`ucom://call/outgoing/${callUUID}/${handle}/${name}`)
    return Promise.resolve();
});

//firebase background
messaging().setBackgroundMessageHandler(async (remoteMessage)=>{
    console.log(`[${new Date()}] ` + 'Message handled in the background!', remoteMessage);
    console.log(`AppState.currentState`, AppState.currentState);
    //TODO: request open app if from background
    if (AppState.currentState === "background") {
        console.log("UcomNative.launchMainActivity from background")
        UcomNative.launchMainActivity(encodeURI("ucom://call"));
        //await Linking.openURL(`ucom://call`);
        await displayCallRequest(remoteMessage);
    }else{
        //displayCallRequest(message);
    }
});
