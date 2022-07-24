import {News} from './../../types/News/News.type';
import {GenericState} from '../../types/GenericState.type';

export interface NewsState extends GenericState<News[]> {
  newsLoading: boolean;
  newsOffset: number;
  allLoaded: boolean;
}

export const newsInitialState: NewsState = {
  data: null,
  status: 'pending',
  error: null,

  newsLoading: false,
  newsOffset: 0,
  allLoaded: false,
};
