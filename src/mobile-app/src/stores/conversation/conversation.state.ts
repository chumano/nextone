import {Conversation} from './../../types/Conversation/Conversation.type';
import {GenericState} from '../../types/GenericState.type';

export interface ConversationState extends GenericState<Conversation[]> {
  allLoaded :boolean
}

export const conversationInitialState: ConversationState = {
  data: null,
  status: 'pending',
  error: null,
  
  allLoaded: false,
};
