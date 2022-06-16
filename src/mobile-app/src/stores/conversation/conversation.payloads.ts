import { Message } from "../../types/Message/Message.type";

export interface ChatMesage {
    chatKey: 'message',
    data: Message
}
export interface UserOnline {
    chatKey: 'user',
    data: { userId: string, isOnline: boolean }
}

export type ChatData = ChatMesage | UserOnline;