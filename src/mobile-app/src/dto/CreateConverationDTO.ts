import { ConversationType } from "../types/Conversation/ConversationType.type";

export interface CreateConverationDTO {
    name: string,
    type: ConversationType,
    memberIds: string[]
}