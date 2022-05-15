import classNames from 'classnames'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Conversation } from '../../models/conversation/Conversation.model'
import { ConversationType } from '../../models/conversation/ConversationType.model'
import { IAppStore } from '../../store'
import { chatActions } from '../../store/chat/chatReducer'
import UserAvatar from './UserAvatar'

interface ConversationItemProps {
    conversation: Conversation
}
const ConversationItem: React.FC<ConversationItemProps> = 
    ({ conversation }) => {
    const user = useSelector((store:IAppStore)=>store.auth.user);
    const selectedConversationId = useSelector((store:IAppStore)=>store.chat.selectedConversationId);
    const dispatch = useDispatch();
    const otherUsers = conversation.members.filter(o=>o.userMember.userId!=user!.profile.sub)
    
    return (
        <div className={classNames({
                'conversation-item clickable': true,
                'active' : conversation.id === selectedConversationId
            })} 
            onClick={()=>{
                dispatch(chatActions.selectConversation(conversation.id))
            }}>
            
            {conversation.type !== ConversationType.Peer2Peer &&
                conversation.name
            }
            {conversation.type === ConversationType.Peer2Peer &&
                <>
                    <UserAvatar user={otherUsers[0].userMember}/>
                    <div className='conversation-name'>
                        {otherUsers[0].userMember.userName} 
                    </div>
                    <div className='flex-spacer'></div>
                </>
            }

        </div>
    )
}

export default ConversationItem