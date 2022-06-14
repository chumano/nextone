import {UserTokenInfo} from '../../types/Auth/Auth.type';
import {GenericState} from '../../types/GenericState.type';

export interface AuthState extends GenericState<UserTokenInfo> {
  isUserLogin: boolean;
}

export const authInitialState: AuthState = {
  isUserLogin: false,
  data: null,
  status: 'pending',
  error: null,
};
