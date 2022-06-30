
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import BackgroundTimer from "react-native-background-timer";
const HEART_BEAT = 'HEART_BEAT';
export const startSendHeartBeat = (callback: ()=>void) => {
    stopSendHeartBeat();
    if (Platform.OS === "ios") {
      BackgroundTimer.start();
    }
  
    callback();
    const intervalId = BackgroundTimer.setInterval(async () => {
      callback();
    }, 60000);
    
    AsyncStorage.setItem(HEART_BEAT, intervalId.toString());
  };
  
  export const stopSendHeartBeat = async () => {
    const intervalId :any= await AsyncStorage.getItem(HEART_BEAT);
  
    if (intervalId) {
      BackgroundTimer.clearInterval(intervalId);
      BackgroundTimer.stop();
    }
  };