import React, { useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css';
import '../../styles/pages/chat/chat.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IAppStore } from '../../store';
import { chatActions, getChannels, getConversations } from '../../store/chat/chatReducer';
import ConversationList from '../../components/chat/ConversationList';
import ChatBox from '../../components/chat/ChatBox';
import { Button, Icon } from 'antd';
import ModalFindUser from '../../components/chat/ModalFindUser';
import no_selected_conversation_bg from '../../assets/images/chat/no_selected_conversation_bg.png';
import ModalChannelCreation from '../../components/chat/ModalChannelCreation';

const ChatPage: React.FC = () => {
    const dispatch = useDispatch();
    const { conversations, channels, modals, selectedConversationId } = useSelector((store: IAppStore) => store.chat);
    useEffect(() => {
        dispatch(getChannels())
        dispatch(getConversations())
    }, [])


    console.log('conversations', conversations)
    console.log('channels', channels)
    return <>
        <div className="chat-page">
            <div className="chat-page__sidebar">
                <div className="search-container">
                    <input type="search" className="form-control" ></input>
                </div>

                <div className="chat-channel-list">
                    <div className="chat-channel-list__header">
                        Kênh
                        <div className='flex-spacer'></div>
                        <Button shape="circle" className='button-icon' onClick={() => {
                            //new channel
                            dispatch(chatActions.showModal({ modal: 'channel_creation', visible: true }))
                        }}>
                            <Icon type="plus" />
                        </Button>
                    </div>
                    <ConversationList conversations={channels} type='channel' />
                </div>

                <div className="chat-users-list">
                    <div className="chat-users-list__header">
                        Tin nhắn
                        <div className='flex-spacer'></div>
                        <Button shape="circle" className='button-icon' onClick={() => {
                            //new chat
                            dispatch(chatActions.showModal({ modal: 'find_user', visible: true }))
                        }}>
                            <Icon type="message" />
                        </Button>
                    </div>
                    <ConversationList conversations={conversations} type='conversation' />
                </div>
            </div>
            <div className="chat-page__main">
                <div className="chatbox__container">
                    {!selectedConversationId &&
                        <div className='no-selected-conversation'>
                            <img src={no_selected_conversation_bg} />

                            <h1>Welcome to Ucom!</h1>
                            <p>
                                Chọn một kênh/tin nhắn để bắt đầu
                            </p>
                        </div>
                    }
                    {selectedConversationId &&
                        <ChatBox />
                    }
                </div>

            </div>
        </div>
        {modals['find_user'] &&
            <ModalFindUser onVisible={(visible) => {
                dispatch(chatActions.showModal({ modal: 'find_user', visible: visible }))
            }} />
        }

        {modals['channel_creation'] &&
            <ModalChannelCreation onVisible={(visible) => {
                dispatch(chatActions.showModal({ modal: 'channel_creation', visible: visible }))
            }} />
        }
    </>
}

export default ChatPage;
