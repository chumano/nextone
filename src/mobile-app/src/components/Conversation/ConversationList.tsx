import React from 'react';
import {FlatList} from 'react-native';

import {Conversation} from '../../types/Conversation/Conversation.type';

import ConversationItem from './ConversationItem';

import {LIST_CONVERSATION} from '../../data/Conversation.data';

const ConversationList = () => {
  return (
    <FlatList
      keyExtractor={(item: Conversation, _) => item.id}
      data={LIST_CONVERSATION}
      renderItem={props => <ConversationItem conversation={props.item} />}
    />
  );
};

export default ConversationList;
