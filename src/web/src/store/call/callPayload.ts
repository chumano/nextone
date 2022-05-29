

export interface StartCallPayload{
    conversationId:string,
    callType: 'voice' | 'video'
}

export interface ReceiveCallPayload{
    conversationId:string
}

export interface PrepareCallPlayload{
    conversationId:string,
    callType: 'voice' | 'video'
}

export interface DeviceSettings{
    videoInputId:string;
    audioInputId:string;
    audioOutputId:string;
}