/**
 * @format
 */

import { AppRegistry, AppState, Linking, NativeModules, Platform } from 'react-native';
import 'react-native-get-random-values'
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import bgMessaging from './bgMessaging';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    //console.log('RNCallKeepBackgroundMessage', { name, callUUID, handle })
    //Linking.openURL(`ucom://call/outgoing/${callUUID}/${handle}/${name}`)
    return Promise.resolve();
});

//firebase background
messaging().setBackgroundMessageHandler(bgMessaging);
