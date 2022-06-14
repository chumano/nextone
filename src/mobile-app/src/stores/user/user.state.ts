import {User} from './../../types/User/User.type';
import {GenericState} from '../../types/GenericState.type';

export interface UserState extends GenericState<User> {}

export const userInitialState: UserState = {
  data: null,
  status: 'pending',
  error: null,
};
