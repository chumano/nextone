import { CallMessageData } from "../types/CallMessageData";

export const CallSignalingActions = {
    SEND_CALL_REQUEST: 'call-send-request',
    SEND_CALL_REQUEST_RESPONSE: 'call-send-request-response',
    SEND_SESSION_DESCRIPTION: 'call-send-session-description',
    SEND_ICE_CANDIDATE: 'call-send-ice-cadidate',
    SEND_HANG_UP: 'call-send-hangup',
}

export const CallSignalingEvents = {
    CALL_MESSAGE: 'call-message',
    CALL_REQUEST: 'call-request'
}

export const CallEvents = {
    GOT_LOCAL_STREAM: 'local-stream',
    GOT_REOMOTE_STREAM: 'remote-stream',
    RECEIVE_CALL_REQUEST: 'receive-call-request',
    CONNECTION_DISCONECTED: 'connection-disconnected',
    CALL_STOPED: 'call-stopped'
}

export interface CallMessage {
    type: 'call-request-response'
    | 'other-session-description'
    | 'other-ice-candidate'
    | 'other-hangup',
    data: any;
}

class CallService{
    public constructor(){

    }
    _callData : {
        [key:string] : CallMessageData
    } = {
    }

    _isRinging = false;


    storeCallInfo(callId: string, data : CallMessageData){
        this._isRinging = true;
        this._callData[callId] = data;
    }

    getCallInfo(callId: string){
        return this._callData[callId];
    }

    clearCallInfo(callId?: string){
        this._isRinging = false;
        if(callId){
            delete this._callData[callId];
        }else{
            this._callData = {}
        }
    }

    get isRinging(){
        return this._isRinging;
    }

    isCalling = false;

    isReceiceResponse = false;
}

const CallServiceInstance = new CallService();
export default CallServiceInstance;