
import { v4 as uuidv4 } from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import { CallMessageData } from '../types/CallMessageData';
import CallService, { CallSignalingActions, CallSignalingEvents } from '../services/CallService';
import { AppState } from 'react-native';

export const displayCallRequest = async (message: CallMessageData)=>{
    console.log(`AppState.currentState`, AppState.currentState);
    console.log('displayCallRequest', message)
    if (message.type != 'call') {
      return;
    }
  
    let uuid = uuidv4();
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
  
    CallService.storeCallInfo(uuid, message);
  
    setTimeout(() => {
      if (CallService.isRinging) {
        CallService.clearCallInfo(uuid)
        // 6 = MissedCall
        // https://github.com/react-native-webrtc/react-native-callkeep#constants
        RNCallKeep.reportEndCallWithUUID(uuid, 6);
      }
    }, 15000);
  }