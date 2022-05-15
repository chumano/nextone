import classnames from 'classnames';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Conversation } from '../../models/conversation/Conversation.model';
import ConversationItem from './ConversationItem';
import no_channel_bg from '../../assets/images/chat/no_channel_bg.png';
import no_conversation_bg from '../../assets/images/chat/no_conversation_bg.png';

import '../../styles/components/chat/conversation.scss';
import Loading from '../controls/loading/Loading';

interface ConversationListProps {
    conversations: Conversation[],
    type: 'channel' | 'conversation'
    loading?: boolean,
    className?: string
}
const ConversationList: React.FC<ConversationListProps> = 
    ({ conversations, type,  loading, className }) => {
    const dispatch = useDispatch();
    return (
        <>
            <div className={classnames('conversation-list', className)}>
                {loading &&
                    <Loading/>
                }
                {!loading && conversations.length===0 &&
                    <div className='empty-conversation'>
                        <img src={type==='channel'?no_channel_bg: no_conversation_bg} />
                        
                        <div style={{marginTop: '10px'}}>
                            {type =='channel' &&
                                <h6>Không có kênh nào được tạo</h6>
                            }
                            {type =='conversation' &&
                                <h6>Không có tin nhắn nào</h6>
                            }
                        </div>
                       
                        
                    </div>
                }
                {!loading && conversations.map(o =>
                    <ConversationItem conversation={o} key={o.id}/>
                )}
            </div>
        </>
    )
}

export default ConversationList;