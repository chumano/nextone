export interface IMessageData {
    type: 'call' | 'message' | string
}

export interface CallMessageData{
    type: 'call' 
    conversationId: string,
    //call
    senderId : string,
    senderName: string,
    callType: 'voice' | 'video';
    requestDate?: string

}

export interface ChatMessageData{
    type:  'message'
    conversationId: string,
}