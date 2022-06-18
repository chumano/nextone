import {Event} from '../../types/Event/Event.type';
import {GenericState} from '../../types/GenericState.type';

export interface EventState extends GenericState<Event[]> {}

export const eventInitialState: EventState = {
  data: null,
  status: 'pending',
  error: null,
};
