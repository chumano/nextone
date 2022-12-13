
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import BackgroundTimer from "react-native-background-timer";
const HEART_BEAT = 'HEART_BEAT';
export const startSendHeartBeat = async (callback: () => void) => {
  callback();
  BackgroundTimer.runBackgroundTimer(async () => {
    callback();
  }, 60000)
};

export const stopSendHeartBeat = async () => {
  BackgroundTimer.stopBackgroundTimer();
};