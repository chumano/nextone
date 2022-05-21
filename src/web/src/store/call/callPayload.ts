

export interface StartCallPayload{
    conversationId:string,
    callType: 'voice' | 'video'
}

export interface ReceiveCallPayload{
    conversationId:string
}