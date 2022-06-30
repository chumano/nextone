import { Conversation } from "../conversation/Conversation.model"
import { ConversationType } from "../conversation/ConversationType.model"

export interface SearchDTO{
    textSearch: string,
    conversationType?: ConversationType
}

export interface SearchResult{
    conversations: Conversation[]
}