import {Conversation} from './../../types/Conversation/Conversation.type';
import {GenericState} from '../../types/GenericState.type';

export interface ConversationState extends GenericState<Conversation[]> {

  conversationsLoading: boolean;
  conversationsOffset: number;
  allLoaded :boolean;
}

export const conversationInitialState: ConversationState = {
  data: null,
  status: 'pending',
  error: null,

  conversationsLoading: false,
  conversationsOffset: 0,
  allLoaded: false,
};
