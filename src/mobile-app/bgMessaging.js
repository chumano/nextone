
import { AppRegistry, AppState, Linking, NativeModules, Platform } from 'react-native';
const { UcomNative } = NativeModules;
import {backgroundSetup, displayCallRequest} from './src/utils/callUtils'
import RNCallKeep from 'react-native-callkeep';

export default async (remoteMessage) => {
    console.log(`[${new Date()}] ` + 'Message handled in the background!', remoteMessage);
    console.log(`AppState.currentState`, AppState.currentState);
    //TODO: request open app if from background
    if (AppState.currentState === "background") {
        console.log("backgroundSetup from background222")
        
        await backgroundSetup();

        // if(AppState.currentState ==='background'){
        //     RNCallKeep.backToForeground();
        // }

        const message = remoteMessage.data; //CallMessageData
        await displayCallRequest(message);
    }else{
        //displayCallRequest(message);
    }
    return Promise.resolve();
}