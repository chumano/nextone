
import { AppRegistry, AppState, Linking, NativeModules, Platform } from 'react-native';
const { UcomNative } = NativeModules;
import {backgroundSetup, displayCallRequest} from './src/utils/callUtils';

export default async (remoteMessage) => {
    console.log(`[${new Date()}] ` + 'Message handled in the background!', remoteMessage);
    //console.log(`AppState.currentState`, AppState.currentState);

    //request open app if from background
    const message = remoteMessage.data; //CallMessageData

    if(message.type !=='call'){
        return Promise.resolve();
    }

    if (AppState.currentState === "background") {
        await backgroundSetup();
    }
   
    await displayCallRequest(message);
    return Promise.resolve();
}