import { Channel } from "../../models/channel/Channel.model";
import { Conversation } from "../../models/conversation/Conversation.model";

export interface ChatState{
    userId?: string;
    conversationsLoading: boolean,
    conversations: ConversationState[],

    channels: Channel[],
    modals: {[key:string]:boolean},

    selectedConversationId?: string
}

export interface ConversationState extends Conversation{
    messagesLoadMoreEmtpy?:boolean,
    messagesLoading?:boolean,
}