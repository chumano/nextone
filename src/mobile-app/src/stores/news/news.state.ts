import {News} from './../../types/News/News.type';
import {GenericState} from '../../types/GenericState.type';

export interface NewsState extends GenericState<News[]> {}

export const newsInitialState: NewsState = {
  data: null,
  status: 'pending',
  error: null,
};
