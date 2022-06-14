import React, { useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css';
import '../../styles/pages/chat/chat-page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IAppStore } from '../../store';
import { chatActions } from '../../store/chat/chatReducer';
import ConversationList from '../../components/chat/ConversationList';
import ChatBox from '../../components/chat/ChatBox';
import { Button } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import ModalFindUser from '../../components/chat/ModalFindUser';
import no_selected_conversation_bg from '../../assets/images/chat/no_selected_conversation_bg.png';
import ModalChannelCreation from '../../components/chat/ModalChannelCreation';
import ConversationInfo from '../../components/chat/ConversationInfo';
import { ConversationState } from '../../store/chat/ChatState';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import ModalMemberRole from '../../components/chat/ModalMemberRole';
import ModalAddMember from '../../components/chat/ModalAddMember';
import { getChannels, getConversations } from '../../store/chat/chatThunks';
import { comApi } from '../../apis/comApi';

const ChatPage: React.FC = () => {
    const dispatch = useDispatch();
    const { conversations, channels,
        conversationsLoading,
        modals,
        modalDatas,
        allConversations,
        selectedConversationId,
        isShowConversationInfo,
        notLoadedConversationId
    } = useSelector((store: IAppStore) => store.chat);
    const user = useSelector((store: IAppStore) => store.auth.user);
    const systemUserRole = user?.profile.role;
    useEffect(() => {
        dispatch(getChannels({
            offset: 0,
            pageSize: 20
        }))
        dispatch(getConversations({
            isExcludeChannel: true,
            offset: 0,
            pageSize: 20
        }))
    }, [dispatch]);

    useEffect(() => {
        if (!notLoadedConversationId) return;
        const fetchConversation = async () => {
            const response = await comApi.getConversation(notLoadedConversationId);
            if (response.isSuccess) {
                const conversation = response.data;
                dispatch(chatActions.addConversationOrChannel(conversation));
            }
        }
        fetchConversation();
    }, [dispatch, notLoadedConversationId])

    const [conversation, setConversation] = useState<ConversationState>();

    useEffect(() => {
        const conversation = allConversations.find(o => o.id == selectedConversationId);
        setConversation(conversation);
    }, [selectedConversationId, allConversations])


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
                        { (systemUserRole === 'admin'|| systemUserRole ==='manager' )&&
                            <Button shape="circle" className='button-icon' onClick={() => {
                                //new channel
                                dispatch(chatActions.showModal({ modal: 'channel_creation', visible: true }))
                            }}>
                                <PlusOutlined />
                            </Button>
                        }

                    </div>
                    <ConversationList type='channel' conversations={channels}
                        loading={conversationsLoading} />
                </div>

                <div className="chat-users-list">
                    <div className="chat-users-list__header">
                        Tin nhắn
                        <div className='flex-spacer'></div>
                        <Button shape="circle" className='button-icon' onClick={() => {
                            //new chat
                            dispatch(chatActions.showModal({ modal: 'find_user', visible: true }))
                        }}>
                            <MessageOutlined />
                        </Button>
                    </div>
                    <ConversationList type='conversation' conversations={conversations}
                        loading={conversationsLoading} />
                </div>
            </div>

            {/* --chatbox-- */}
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
                    {conversation &&
                        <>
                            <ChatBox conversation={conversation} />
                            {isShowConversationInfo &&

                                <ConversationInfo conversation={conversation} />
                            }
                        </>
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

        {modals['member_role'] &&
            <ModalMemberRole conversation={modalDatas['member_role'].conversation}
                member={modalDatas['member_role'].member}
                onVisible={(visible) => {
                    dispatch(chatActions.showModal({ modal: 'member_role', visible: visible }))
                }} />
        }

        {modals['add_member'] &&
            <ModalAddMember conversation={modalDatas['add_member']} onVisible={(visible) => {
                dispatch(chatActions.showModal({ modal: 'add_member', visible: visible }))
            }} />
        }


    </>
}

export default ChatPage;
