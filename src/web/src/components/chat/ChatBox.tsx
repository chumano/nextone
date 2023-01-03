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
import { DeviceManager } from '../../services/DeviceManager';
import { message } from 'antd';
import { MemberRole } from '../../models/conversation/ConversationMember.model';
import { EventInfo } from '../../models/event/Event.model';

interface ChatBoxProps {
    conversation: ConversationState,
    userRole?: MemberRole,
    onDeleteEvent?: (item: EventInfo)=> void
}


const deviceManager = new DeviceManager();
const ChatBox: React.FC<ChatBoxProps> = ({ conversation, userRole, onDeleteEvent }) => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const { deviceSettings } = useSelector((store: IAppStore) => store.call);
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

    useEffect(()=>{
        console.log('Conversation change', conversation.id)
    },[conversation])

    const showDeviceSetting = () => {
        //TODO: show Modal select devices
        // if (!deviceSettings) {
        //     dispatch(callActions.prepareCall({
        //         callType,
        //         conversationId: conversation.id
        //     }));
        //     dispatch(callActions.showModal({ modal: 'device', visible: true }));
        // } else
    }

    const onCall = useCallback(async (callType: 'video' | 'voice') => {

        const devices = await deviceManager.enumerateDevices();
        const videoInputs = devices.filter(o => o.type == 'videoinput');
        const audioInputs = devices.filter(o => o.type == 'audioinput');
        //const audioOutputs = devices.filter(o => o.type == 'audiooutput');
        //console.log({ devices,  videoInputs,  audioInputs})
        //if has has device then start
        if (callType === 'voice') {
            if (audioInputs.length == 0) {
                message.error('Không tìm thấy audio input')
                return;
            }
        }

        if (callType === 'video') {
            if (videoInputs.length == 0) {
                message.error('Không tìm thấy video input')
                return;
            }
        }

        {
            dispatch(callActions.startCall({
                callType,
                conversationId: conversation.id
            }));
        }

    }, [conversation, deviceSettings])

    const onToggleConversationInfo = useCallback(() => {
        dispatch(chatActions.toggleConversationInfo());
    }, [dispatch]);

    return <>
        {conversation &&
            <div className='chatbox'>
                <div className="chat-header">
                    {conversation.type === ConversationType.Peer2Peer &&
                        <>
                            <span className='clickable' onClick={() => {
                                dispatch(chatActions.showModal({ modal: 'user_info', visible: true, data: otherUser }))
                            }}>
                                <UserAvatar user={otherUser} />
                            </span>
                            <div className="chat-header--name clickable" title={conversation.id} onClick={() => {
                                dispatch(chatActions.showModal({ modal: 'user_info', visible: true, data: otherUser }))
                            }}>
                                {conversationName}
                            </div>
                        </>
                    }
                    {conversation.type !== ConversationType.Peer2Peer &&
                        <>
                            <ConversationAvatar />
                            <div className="chat-header--name" title={conversation.id}>
                                {conversationName}
                            </div>
                        </>
                    }

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
                    <MessageList conversation={conversation} userRole={userRole} 
                        onDeleteEvent={onDeleteEvent}/>
                </div>
                <div className="chat-send-box">
                    <ChatInput />
                </div>
            </div>
        }
    </>
}

export default ChatBox