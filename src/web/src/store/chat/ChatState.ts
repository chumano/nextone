import { Channel } from "../../models/channel/Channel.model";
import { Conversation } from "../../models/conversation/Conversation.model";

export interface ChatState{
    conversations: Conversation[],
    channels: Channel[],

    selectedConversationId?: string
}