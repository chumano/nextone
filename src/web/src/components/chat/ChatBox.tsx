import React, { useCallback, useEffect, useRef, useState } from 'react'

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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import logo from '../../assets/logo.png';
import { messageList } from '../../pages/chat/fakedate';
import ModalFindUser from './ModalFindUser';
import UserAvatar from './UserAvatar';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { callActions, IAppStore } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Conversation } from '../../models/conversation/Conversation.model';
import { Button, Input, Modal } from 'antd';
import { chatActions, sendMessage } from '../../store/chat/chatReducer';
import MessageList from './MessageList';
import '../../styles/pages/chat/chat-box.scss';
import { fileApi } from '../../apis/fileApi';

const ChatBox = () => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const { selectedConversationId, conversations } = useSelector((store: IAppStore) => store.chat);
    
    const [conversation, setConversation] = useState<Conversation>();
    const [conversationName, setConversationName] = useState<string>();
    const [messageText, setMessageText] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        const conversation = conversations.find(o => o.id == selectedConversationId);
        setConversation(conversation);
        if (conversation?.type === ConversationType.Peer2Peer) {
            const otherUsers = conversation.members.filter(o => o.userMember.userId != user!.profile.sub)
            setConversationName(otherUsers[0].userMember.userName)
        } else {
            setConversationName(conversation?.name);
        }
    }, [selectedConversationId, conversations])

    const onSendMessage = useCallback(() => {
        if(!messageText?.trim()){
            return;
        }
        console.log({messageText})
        dispatch(sendMessage({
            conversationId: selectedConversationId!,
            content: messageText!
        }))
        setMessageText('');
    }, [selectedConversationId,messageText,setMessageText])

    const onCall = useCallback((callType: 'video'| 'voice')=>{
        dispatch(callActions.startCall({
            callType,
            conversationId : selectedConversationId!
        }))
    },[selectedConversationId])


    const onUploadFiles = useCallback((type: string)=>{
        if(!fileInputRef.current) return;
        let fileAcceptExtestions = '';
        switch(type){
            case 'image':
                fileAcceptExtestions = '.png,.jpeg,image/*';
                break;
            case 'video':
                fileAcceptExtestions = '.mp4,.avi,video/*';
                break;
            case 'file':
                fileAcceptExtestions = '.pdf,.doc,.docs,.xls,.xlsx,.zip,.txt';
                break;
        }
        fileInputRef.current.accept = fileAcceptExtestions;
        fileInputRef.current.click();

    },[fileInputRef]);

    const onFileInputChanged =  useCallback(async (e)=>{
        const input = e.target as HTMLInputElement;
        const files = input.files!;
        //validate : chỉ 5 files 1 lúc
        //size 1 file: 10MB
        const maxFileSize = 10*1024*1024;
        if(files.length > 5){
            Modal.error({
                title: 'Tối đa chỉ chọn 5 files'
              });
            return;
        }
        for(const file of Array.from(files)){
            if(file.size > maxFileSize){
                Modal.error({
                    title: 'Kích thước 1 file tối đa là 10MB'
                  });
                return;
            }
        }
        console.log('onFileInputChanged', files)
        var uploadResponse = await fileApi.uploadFiles(files,'message');
        if(!uploadResponse.isSuccess){
            Modal.error({
                title: 'Có lỗi khi tải file',
                content: uploadResponse.errorMessage
              });
            return;
        }

        fileInputRef.current!.value = '';
        var uploadedFiles = uploadResponse.data;
        debugger;
        dispatch(sendMessage({
            conversationId: selectedConversationId!,
            content: '',
            files : uploadedFiles
        }))
    },[])
    return <>
        {conversation &&
            <div className='chatbox'>
                <div className="chat-header">
                    <UserAvatar />
                    <div className="chat-header--name">
                        {conversationName}
                    </div>
                    <div className="flex-spacer"></div>

                    <div className="chat-header__tools">
                        <FontAwesomeIcon icon={faPhone} className="tool clickable"
                                onClick={()=> onCall('voice')}
                            />
                        <FontAwesomeIcon icon={faVideo} className="tool clickable" 
                                onClick={()=> onCall('video')}
                            />
                        <FontAwesomeIcon icon={faInfoCircle} className="tool clickable" />
                    </div>
                </div>
                <div className="chat-content">
                    <MessageList   conversation={conversation} />
                </div>
                <div className="chat-send-box">
                    <div>
                        <input type="file" multiple  ref={fileInputRef} className="display-none"
                            onChange={onFileInputChanged}/>
                        <FontAwesomeIcon icon={faPaperclip} className="input-button clickable" 
                            onClick={()=> onUploadFiles('file')}/>
                        <FontAwesomeIcon icon={faImages} className="input-button clickable"
                            onClick={()=> onUploadFiles('image')}/>
                        <FontAwesomeIcon icon={faPhotoVideo} className="input-button clickable"
                            onClick={()=> onUploadFiles('video')}/>
                    </div>
                    <div className='text-input'>
                        <Input value={messageText} 
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onSendMessage();
                                }
                            }} 
                            onChange={(e)=>{
                                setMessageText(e.target.value)
                            }}
                            />
                    </div>
                    <Button type="primary"  onClick={() => {
                        onSendMessage();
                    }} >Gửi</Button>

                </div>
            </div>
        }
    </>
}

export default ChatBox