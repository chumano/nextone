import React, { useCallback, useEffect, useRef, useState } from 'react'

//https://fontawesome.com/v5.15/icons?d=gallery&p=2&q=video&s=regular,solid&m=free
import {
    faPhone,
    faVideo,
    faInfoCircle
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserAvatar from './UserAvatar';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { callActions, IAppStore } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import MessageList from './message/MessageList';
import '../../styles/pages/chat/chat-box.scss';
import { ConversationState } from '../../store/chat/ChatState';
import { chatActions } from '../../store/chat/chatReducer';
import ChatInput from './input/ChatInput';
import { UserStatus } from '../../models/user/UserStatus.model';
import ConversationAvatar from './ConversationAvatar';

interface ChatBoxProps {
    conversation: ConversationState
}
const ChatBox: React.FC<ChatBoxProps> = ({ conversation }) => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const [conversationName, setConversationName] = useState<string>();
    const [otherUser, setOtherUser] = useState<UserStatus>();
    useEffect(() => {
        if (conversation.type === ConversationType.Peer2Peer) {
            const otherUsers = conversation.members.filter(o => o.userMember.userId != userId)
            setOtherUser(otherUsers[0].userMember);
            setConversationName(otherUsers[0].userMember.userName)
        } else {
            setConversationName(conversation.name);
        }
    }, [conversation])

    const onCall = useCallback((callType: 'video' | 'voice') => {
        dispatch(callActions.startCall({
            callType,
            conversationId: conversation.id
        }));
    }, [conversation])

    const onToggleConversationInfo = useCallback(() => {
        dispatch(chatActions.toggleConversationInfo());
    }, [dispatch]);

    return <>
        {conversation &&
            <div className='chatbox'>
                <div className="chat-header">
                    {conversation.type === ConversationType.Peer2Peer &&
                        <UserAvatar user={otherUser} />
                    }
                    {conversation.type !== ConversationType.Peer2Peer &&
                        <ConversationAvatar />
                    }

                    <div className="chat-header--name" title={conversation.id}>
                        {conversationName}
                    </div>
                    <div className="flex-spacer"></div>

                    <div className="chat-header__tools">
                        {conversation.type != ConversationType.Channel &&
                            <>
                                <FontAwesomeIcon icon={faPhone} className="tool clickable"
                                    onClick={() => onCall('voice')}
                                />
                                <FontAwesomeIcon icon={faVideo} className="tool clickable"
                                    onClick={() => onCall('video')}
                                />
                            </>
                        }

                        {conversation.type != ConversationType.Peer2Peer &&
                            <FontAwesomeIcon icon={faInfoCircle} className="tool clickable"
                                onClick={() => onToggleConversationInfo()}
                            />
                        }
                    </div>
                </div>
                <div className="chat-content">
                    <MessageList conversation={conversation} />
                </div>
                <div className="chat-send-box">
                    <ChatInput />
                </div>
            </div>
        }
    </>
}

export default ChatBox