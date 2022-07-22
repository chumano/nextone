import {IPageOptions} from '../types/PageOptions.type';

export interface GetListNewsDTO extends IPageOptions {
  publishState: PublishState;
}

export enum PublishState {
  All,
  Yes,
  No,
}
