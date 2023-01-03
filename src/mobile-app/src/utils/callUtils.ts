
import { v4 as uuidv4 } from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import { CallMessageData } from '../types/CallMessageData';
import CallService, { CallSignalingActions, CallSignalingEvents } from '../services/CallService';
import { AppState } from 'react-native';
import { AppDispatch, IAppStore, appStore } from '../stores/app.store';
import { callActions } from '../stores/call/callReducer';
import signalRService from '../services/SignalRService';

export const CALL_WAIT_TIME = 60000; //milisecods
//https://github.com/react-native-webrtc/react-native-callkeep/pull/576/files
export const callKeepOptions = {
  ios: {
    appName: 'UCOM',
  },
  android: {
    alertTitle: 'Yêu cầu cấp quyền',//'Permissions required',
    alertDescription: 'Ứng dụng cần quyền để nhận cuộc gọi',//'This application needs to access your phone accounts',
    cancelButton: 'Hủy',//'Cancel',
    okButton: 'Đồng ý',//'ok',
    imageName: 'phone_account_icon',
    additionalPermissions:  [],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.ucom',
      channelName: 'Foreground service for UCOM',
      notificationTitle: 'UCOM is running on background',
      //notificationIcon: 'Path to the resource icon of the notification',
    },
  },
};

export const backgroundSetup = async()=>{
  await RNCallKeep.registerPhoneAccount(callKeepOptions)

  await RNCallKeep.registerAndroidEvents()

  await RNCallKeep.setAvailable(true)

  RNCallKeep.addEventListener('answerCall', answerCall);
  RNCallKeep.addEventListener('endCall', endCall);
}

var listenTimeoutRef :any ;
export const displayCallRequest = async (message: CallMessageData, time_to_wait_in_ms?: number)=>{
    //console.log(`AppState.currentState`, AppState.currentState);
    time_to_wait_in_ms = time_to_wait_in_ms || CALL_WAIT_TIME;
    //console.log(`displayCallRequest ${time_to_wait_in_ms}`, message)
    
    if (message.type != 'call') {
      console.error('message.type', message.type)
      return;
    }

    //check timeout
    if(message.requestDate){
      
      const now = (new Date()).getTime();
      const requestDate = Date.parse(message.requestDate);
      if(!Number.isNaN(requestDate)){
        if(now - requestDate > time_to_wait_in_ms){
          console.error('Request is timeout', {message, now, requestDate})
          return;
        }
      }
    }
  
    let uuid = uuidv4();

    if (!CallService.isCalling) {
      //console.log('storeCallInfo', uuid)
      CallService.storeCallInfo(uuid, message);
    }
    RNCallKeep.displayIncomingCall(
      uuid,
      message.senderName,
      `Có cuộc gọi từ ${message.senderName}`,
      'generic',
      message.callType === 'video',
      {},
    );

    if (CallService.isCalling) {
      setTimeout(() => {
        RNCallKeep.reportEndCallWithUUID(uuid, 6);
      }, 1000)
      return;
    }
  
    //Tự động tắt sau 1 khoảng thời gian
    if(listenTimeoutRef) clearTimeout(listenTimeoutRef);
    listenTimeoutRef = setTimeout(() => {
      if (CallService.isRinging) {
        CallService.clearCallInfo(uuid)
        // 6 = MissedCall
        // https://github.com/react-native-webrtc/react-native-callkeep#constants
        RNCallKeep.reportEndCallWithUUID(uuid, 6);
      }
    }, time_to_wait_in_ms);
  }

  

export const answerCall = async (data: any) => {
  try {
    if(listenTimeoutRef) {
      clearTimeout(listenTimeoutRef);
      listenTimeoutRef= undefined;
    }
    //console.log(`[answerCall]: `, data);
    const { callUUID } = data;
    RNCallKeep.rejectCall(callUUID); //end RNCallKeep UI

    //Show App Call Screen
    if(AppState.currentState ==='background'){
      //console.log('RNCallKeep.backToForeground')
      RNCallKeep.backToForeground();
    }

    //TODO: if in locked , open key board to unlock phone
    const callInfo = CallService.getCallInfo(callUUID);
    //console.log(`[callInfo]: `, callInfo);
    if (callInfo) {
      CallService.clearCallInfo(callUUID);
      appStore.dispatch(callActions.call({
        callInfo: callInfo
      }));
    }
  } catch (err) {
    console.error(`[answerCall]: `, err);
  }

};

export const endCall = async (data: any) => {
  if(listenTimeoutRef) {
    clearTimeout(listenTimeoutRef);
    listenTimeoutRef= undefined;
  }
  //console.log(`[endCall],: `, data);
  const { callUUID } = data;
  const callInfo = CallService.getCallInfo(callUUID);
  if (callInfo) {
    await signalRService.invoke(
      CallSignalingActions.SEND_CALL_REQUEST_RESPONSE,
      {
        room: callInfo.conversationId,
        accepted: false
      }
    );
  }
};