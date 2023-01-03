import { faImages, faPaperclip, faPhotoVideo, faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Modal } from 'antd';
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fileApi } from '../../../apis/fileApi';
import { MessageType } from '../../../models/message/MessageType.model';
import { UserStatus } from '../../../models/user/UserStatus.model';
import { callActions, IAppStore } from '../../../store';
import { sendMessage } from '../../../store/chat/chatThunks';
import { getMessageType, nowDate } from '../../../utils/functions';
import { MessageUpload } from '../message/MessageItemUpload';
import { chatActions } from '../../../store/chat/chatReducer';

const ChatInput = () => {
    const dispatch = useDispatch();
    const { selectedConversationId, userId } = useSelector((store: IAppStore) => store.chat);
    const [messageText, setMessageText] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onSendMessage = useCallback(() => {
        if (!messageText?.trim()) {
            return;
        }
        
        dispatch(sendMessage({
            conversationId: selectedConversationId!,
            content: messageText!
        }))
        setMessageText('');
    }, [selectedConversationId, messageText, setMessageText])

    const onUploadFiles = useCallback((type: string) => {
        if (!fileInputRef.current) return;
        let fileAcceptExtestions = '';
        switch (type) {
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

    }, [fileInputRef]);

    const handleUploadFiles= useCallback( async (files: File[])=>{
        fileInputRef.current!.value = '';
        const send = (i: number)=>{
            const file = files[i];
            const messageType = getMessageType(file.type);
            //create uploadMessage
            const fakeid = 'fake-' + i + (new Date()).toString();
            const message : MessageUpload = {
                conversationId : selectedConversationId!,
                type: messageType,
                uploadFile : file,
                state : 'upload',
                id: fakeid,
                content: '',
                sentDate: nowDate(),
                userSender:  {
                    userId: userId!
                } as UserStatus,
                files : []
            }

            //add temp message
            dispatch(chatActions.addTempMessage(message));
        }
        for(let i =0 ;i < files.length; i++){
            setTimeout(()=>{
                send(i)
            }, i*500);
        }

    },[fileInputRef,userId,selectedConversationId, fileApi])

    const onFileInputChanged = useCallback(async (e) => {
        const input = e.target as HTMLInputElement;
        const files = input.files!;
        //validate : chỉ 5 files 1 lúc
        //size 1 file: 10MB
        const maxFileSize = 10 * 1024 * 1024;
        if (files.length > 5) {
            Modal.error({
                title: 'Tối đa chỉ chọn 5 files'
            });
            return;
        }
        for (const file of Array.from(files)) {
            if (file.size > maxFileSize) {
                Modal.error({
                    title: 'Kích thước 1 file tối đa là 10MB'
                });
                return;
            }
        }
        //console.log('onFileInputChanged', files)
        handleUploadFiles(Array.from(files))

    }, [handleUploadFiles])

    const onTextFocus = async ()=>{
        console.log('onTextFocus')
    }
    return (
        <div>
            <div className='chat-input'>
                <div>
                    <input type="file" multiple ref={fileInputRef} className="display-none"
                        onChange={onFileInputChanged} />
                    <FontAwesomeIcon icon={faPaperclip} className="input-button clickable" title='Tệp tin'
                        onClick={() => onUploadFiles('file')} />
                    <FontAwesomeIcon icon={faImages} className="input-button clickable" title='Hình ảnh'
                        onClick={() => onUploadFiles('image')} />
                    <FontAwesomeIcon icon={faFilm} className="input-button clickable"title='Video'
                        onClick={() => onUploadFiles('video')} />
                </div>
                <div className='text-input'>
                    <Input value={messageText}
                        onFocus={onTextFocus}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onSendMessage();
                            }
                        }}
                        onChange={(e) => {
                            setMessageText(e.target.value)
                        }}
                    />
                </div>
                <Button type="primary" onClick={() => {
                    onSendMessage();
                }} >Gửi</Button>
            </div>
        </div>

    )
}

export default ChatInput