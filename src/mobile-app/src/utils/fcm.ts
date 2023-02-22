
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { firebase } from '@react-native-firebase/messaging';
import { CallMessageData } from '../types/CallMessageData';

export async function requestFBUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    // await registerAppWithFCM();
  
    if (enabled) {
      //console.log('Authorization status:', authStatus);
    }
  
    return enabled;
  }
  
export async function getFCMToken() {
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

    //console.log('getFCMToken = ', { hasNewToken,  token: fcmToken,  oldToken: undefined });
    return {
        hasNewToken,
        token: fcmToken,
        oldToken: undefined
    };
}



export function registerFBForegroundHandler(callback: any){
    return messaging().onMessage((msg:any)=>{
        console.log(`[${new Date()}] ` + 'Message handled in the foreground!', msg);
        callback(msg)
    });
}

