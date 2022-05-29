import { DeviceSettings } from "./callPayload";

export enum CallStatus {
    idle,
    settings,
    calling
}

export type CallModalType = 'device';
export interface ModalState{
    visible: boolean,
    data?: any
}

export interface CallState {
    status : CallStatus;
    isSender: boolean;
    callType: 'voice' | 'video';
    converstationId?: string;
    
    modals: {[key:string]:ModalState};

    
    deviceSettings? : DeviceSettings;
}