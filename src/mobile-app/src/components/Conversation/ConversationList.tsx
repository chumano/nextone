import React, {useEffect} from 'react';
import {FlatList} from 'react-native';

import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useDispatch} from 'react-redux';
import {getListConversation} from '../../stores/conversation/conversation.thunk';

import Loading from '../Loading';
import ConversationItem from './ConversationItem';

import {Conversation} from '../../types/Conversation/Conversation.type';
import {useSelector} from 'react-redux';

const ConversationList = () => {
  const dispatch: AppDispatch = useDispatch();
  const {data, status} = useSelector((store: IAppStore) => store.conversation);
  useEffect(() => {
    dispatch(getListConversation());
  }, [dispatch]);
  if (status === 'loading') return <Loading />;

  return (
    <FlatList
      keyExtractor={(item: Conversation, _) => item.id}
      data={data}
      renderItem={props => <ConversationItem conversation={props.item} />}
    />
  );
};

export default ConversationList;
