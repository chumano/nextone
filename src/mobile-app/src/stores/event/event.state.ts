import {Event} from '../../types/Event/Event.type';
import {GenericState} from '../../types/GenericState.type';

export interface EventState extends GenericState<Event[]> {

  eventsLoading: boolean;
  eventsOffset: number;
  allLoaded :boolean;
}

export const eventInitialState: EventState = {
  data: null,
  status: 'pending',
  error: null,

  eventsLoading: false,
  eventsOffset: 0,
  allLoaded :false,
};
