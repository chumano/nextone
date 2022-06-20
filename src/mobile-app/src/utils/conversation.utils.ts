import { Conversation } from "../types/Conversation/Conversation.type";
import { ConversationType } from "../types/Conversation/ConversationType.type";

export const getConversationName = (conversation: Conversation, currentUserId: string)=>{
    let conversationName: string;

  switch (conversation.type) {
    case ConversationType.Peer2Peer: {
      const otherUser = conversation.members.filter(
        m => m.userMember.userId !== currentUserId,
      )[0];

      conversationName = otherUser.userMember.userName;
      break;
    }
    case ConversationType.Channel:
    case ConversationType.Private:
    case ConversationType.Group:
      conversationName = conversation.name;
      break;
  }

  return conversationName;
}