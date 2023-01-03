import { Tag } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Channel } from '../../models/channel/Channel.model'
import { Conversation } from '../../models/conversation/Conversation.model'
import { ConversationType } from '../../models/conversation/ConversationType.model'
import { UserStatus } from '../../models/user/UserStatus.model'
import { IAppStore } from '../../store'
import { chatActions } from '../../store/chat/chatReducer'
import ConversationAvatar from './ConversationAvatar'
import UserAvatar from './UserAvatar'

interface ConversationItemProps {
    conversation: Conversation
}
const ConversationItem: React.FC<ConversationItemProps> =
    ({ conversation }) => {
        const user = useSelector((store: IAppStore) => store.auth.user);
        const selectedConversationId = useSelector((store: IAppStore) => store.chat.selectedConversationId);
        const dispatch = useDispatch();

        const [name, setName] = useState<string>();
        const [otherUser, setOtherUser] = useState<UserStatus>();
        useEffect(() => {
            let name = conversation.name;
            if (conversation.type == ConversationType.Peer2Peer) {
                const otherUsers = conversation.members.filter(o => o.userMember.userId != user!.profile.sub)
                const otherUser = otherUsers[0].userMember;
                name = otherUser.userName;
                setOtherUser(otherUser);
            }

            setName(name);
        }, [conversation])

        const MAX_LENGTH = 30;
        const displayName = name &&name.length >= MAX_LENGTH?  name.substring(0,MAX_LENGTH-3)+'...' : name;
        return (
            <div className={classNames({
                'conversation-item clickable': true,
                'active': conversation.id === selectedConversationId
            })}
                onClick={() => {
                    dispatch(chatActions.selectConversation(conversation.id))
                }}>
                    
                {conversation.type === ConversationType.Peer2Peer &&
                    <UserAvatar user={otherUser} />
                }
                {conversation.type !== ConversationType.Peer2Peer &&
                    <ConversationAvatar />
                }

                <div className='conversation-name' title={name}>
                    {displayName}

                    {conversation.type === ConversationType.Channel && 
                        <>
                        {(conversation as Channel).allowedEventTypes.length >0 &&
                        <div style={{fontSize:10}}>
                            {(conversation as Channel).allowedEventTypes[0].name}
                        </div>
                        }
                        {(conversation as Channel).ancestors &&
                            <div>
                                {(conversation as Channel).ancestors!.map(o=>(
                                    <Tag key={o.id}>{o.name}</Tag>
                                ))}
                            </div>
                        }
                        </>
                    }
                </div>
                <div className='flex-spacer'></div>

            </div>
        )
    }

export default ConversationItem