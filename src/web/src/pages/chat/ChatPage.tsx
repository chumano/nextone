import React, { useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css';
import '../../styles/pages/chat/chat.scss';
import {
    ChatItem, MessageBox, MeetingMessage, MessageList,
    ChatList, Input, Popup, Dropdown,
    Avatar, MeetingItem, MeetingList
} from 'react-chat-elements';

//https://fontawesome.com/v5.15/icons?d=gallery&p=2&q=video&s=regular,solid&m=free
import {
    faPhone,
    faVideo,
    faInfoCircle,
    faPaperclip,
    faImage,
    faImages,
    faFileVideo,
    faVideoSlash,
    faPhotoVideo
} from "@fortawesome/free-solid-svg-icons";


import { chatList, messageList } from './fakedate';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { chatStore, IChatStore } from '../../store/chat/chatStore';
import { IAppStore } from '../../store';
import { chatActions, getConversations } from '../../store/chat/chatReducer';

const ChatPage: React.FC = () => {
    const dispatch = useDispatch();
    const {conversations, channels} = useSelector((store:IAppStore)=> store.chat);
    useEffect(()=>{
        dispatch(getConversations())
    },[])
    return (
        <div className="chat-page">
            <div className="chat-page__sidebar">
                <div className="search-container">
                    <input type="search" className="form-control" ></input>
                </div>

                <div className="chat-channel-list">
                    <div className="chat-channel-list__header">
                       Kênh
                    </div>
                    <ChatList className='channel-list'
                        dataSource={chatList} />
                </div>

                <div className="chat-users-list">
                    <div className="chat-users-list__header">
                       Tin nhắn
                    </div>
                    <ChatList className='chat-list'
                        dataSource={chatList} />
                </div>
            </div>
            <div className="chat-page__main">

                <div className="chat-box">
                    <div className="chat-header">
                        <Avatar
                            src={logo}
                            alt={'logo'}
                            size="large"
                            type="circle flexible" />
                        <div className="chat-header--name">
                            Hoang Xuan Loc
                        </div>
                        <div className="flex-spacer"></div>
                        <div className="chat-header__tools">
                            <FontAwesomeIcon icon={faPhone} className="tool clickable" />
                            <FontAwesomeIcon icon={faVideo} className="tool clickable" />
                            <FontAwesomeIcon icon={faInfoCircle} className="tool clickable" />
                        </div>
                    </div>
                    <div className="chat-content">
                        <MessageList className='message-list'
                            lockable={true}
                            toBottomHeight={'100$'}
                            dataSource={messageList} />
                    </div>
                    <div className="chat-send-box">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            multiline={true}
                            leftButtons={
                                <span>
                                    <FontAwesomeIcon icon={faPaperclip} className="input-button clickable" />
                                    <FontAwesomeIcon icon={faImages} className="input-button clickable" />
                                    <FontAwesomeIcon icon={faPhotoVideo} className="input-button clickable" />
                                </span>
                            }
                            rightButtons={
                                <span className="clickable">Send</span>
                            } />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ChatPage;
