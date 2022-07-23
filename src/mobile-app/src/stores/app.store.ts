import {NewsState} from './news/news.state';
import {configureStore} from '@reduxjs/toolkit';
import thunk, {ThunkMiddleware} from 'redux-thunk';

import {AuthState} from './auth';
import {ConversationState} from './conversation';
import {CallState} from './call/callState';
import {UserState} from './user/user.state';
import {EventState} from './event/event.state';

import authReducer from './auth/auth.reducer';
import callReducer from './call/callReducer';
import conversationReducer from './conversation/conversation.reducer';
import userReducer from './user/user.reducer';
import eventReducer from './event/event.reducer';
import newsReducer from './news/news.reducer';

export interface IAppStore {
  auth: AuthState;
  call: CallState;
  conversation: ConversationState;
  user: UserState;
  event: EventState;
  news: NewsState;
}
export const appStore = configureStore<IAppStore>({
  reducer: {
    auth: authReducer,
    call: callReducer,
    conversation: conversationReducer,
    user: userReducer,
    event: eventReducer,
    news: newsReducer,
  },
  middleware: [thunk as ThunkMiddleware],
});

export type AppDispatch = typeof appStore.dispatch;
