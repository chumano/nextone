import React, { useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css';
import '../../styles/pages/chat/chat-page.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IAppStore } from '../../store';
import { chatActions } from '../../store/chat/chatReducer';
import ConversationList from '../../components/chat/ConversationList';
import ChatBox from '../../components/chat/ChatBox';
import { Button, Modal } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import ModalFindUser from '../../components/chat/ModalFindUser';
import no_selected_conversation_bg from '../../assets/images/chat/no_selected_conversation_bg.png';
import ModalChannelCreation from '../../components/chat/ModalChannelCreation';
import ConversationInfo from '../../components/chat/ConversationInfo';
import { ConversationState } from '../../store/chat/ChatState';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import ModalMemberRole from '../../components/chat/ModalMemberRole';
import ModalAddMember from '../../components/chat/ModalAddMember';
import { getChannels, getConversations, getOrCreateConversation } from '../../store/chat/chatThunks';
import { comApi } from '../../apis/comApi';
import ModalUserInfo from '../../components/chat/ModalUserInfo';
import { EventInfo } from '../../models/event/Event.model';
import { useHistory, useLocation } from 'react-router-dom';
import { UserStatus } from '../../models/user/UserStatus.model';
import { CreateConverationDTO } from '../../models/dtos';
import { useCallback } from 'react';

const ChatPage: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
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
    const [conversation, setConversation] = useState<ConversationState>();

    const systemUserRole = user?.profile.role;

    //console.log('location.state', location.state)

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

        return ()=>{
            
        }
    }, [dispatch]);

   
    useEffect(()=>{
        if(location.state){
            var actionState = location.state as  { 
                action: 'openConversation',
                user: UserStatus
            }
            if(actionState.action === 'openConversation' && actionState.user?.userId){
                //START_P2P_CHAT
                const conversation: CreateConverationDTO = {
                    name: '',
                    type: ConversationType.Peer2Peer,
                    memberIds: [actionState.user.userId]
                }
                dispatch(getOrCreateConversation(conversation))
            }
            history.replace(location.pathname, null)
        }
    },[location.state])

    useEffect(() => {
        if(location.state){
            return
        }
        const conversation = allConversations.find(o => o.id == selectedConversationId);
        setConversation(conversation);
    }, [selectedConversationId, allConversations, location.state])


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

    

    return <>
        <div className="chat-page">
            <div className="chat-page__sidebar">
                {/* <div className="search-container">
                    <input type="search" className="form-control" ></input>
                </div> */}

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
                    {conversation && <ChatViewContainer conversation={conversation} isShownInfo={isShowConversationInfo}/>
                       
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

        {modals['user_info'] &&
            <ModalUserInfo userStatus={modalDatas['user_info']}  onVisible={(visible) => {
                dispatch(chatActions.showModal({ modal: 'user_info', visible: visible }))
            }} />
        }
    </>
}


const ChatViewContainer: React.FC<{conversation: ConversationState, isShownInfo?: boolean}> 
    = ({conversation, isShownInfo}) => {
    const dispatch = useDispatch();
    const { members } = conversation;
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const userRole = members.find(o => o.userMember.userId === userId)?.role;

    const onDeleteEvent = useCallback((item: EventInfo) => {
        Modal.confirm({
            title: `Bạn có muốn xóa sự kiện không?`,
            onOk: async () => {
                const response = await comApi.deleteChannelEvent({
                    channelId: conversation.id,
                    eventId: item.id
                });

                if (!response.isSuccess) {
                    Modal.error({
                        title: 'Không thể xóa sự kiện',
                        content: response.errorMessage
                      });
                    return;
                }

                dispatch(chatActions.deleteChannelEvent({
                    channelId: conversation.id,
                    eventId: item.id
                }));

            },
            onCancel() {
            },
        });
        
    },[dispatch]);
    
    return  <>
        <ChatBox key={conversation.id} conversation={conversation} 
            userRole={userRole} onDeleteEvent={onDeleteEvent}/>
        {isShownInfo &&
            <ConversationInfo conversation={conversation} 
                userRole={userRole} onDeleteEvent={onDeleteEvent}/>
        }
    </>
}
export default ChatPage;
