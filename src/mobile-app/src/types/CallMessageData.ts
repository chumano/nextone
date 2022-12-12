export interface CallMessageData{
    type: 'call' | string,
    conversationId: string,
    senderId : string,
    senderName: string,
    callType: 'voice' | 'video';
    requestDate?: string
}