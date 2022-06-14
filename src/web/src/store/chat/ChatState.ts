import { Channel } from "../../models/channel/Channel.model";
import { Conversation } from "../../models/conversation/Conversation.model";

export interface ChatState{
    userId?: string;
    conversationsLoading: boolean;

    allConversations : ConversationState[];
    conversations: ConversationState[];
    channels: ConversationState[];
    
    modals: {[key:string]:boolean};
    modalDatas: {[key:string]:any};

    isShowConversationInfo?: boolean;
    selectedConversationId?: string;
    selectedConversatio?: ConversationState;

    notLoadedConversationId?: string
}

export interface ConversationState extends  Conversation , Channel
{
    messagesLoadMoreEmtpy?:boolean,
    messagesLoading?:boolean,
}