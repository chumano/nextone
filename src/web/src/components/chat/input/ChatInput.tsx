import { faImages, faPaperclip, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Modal } from 'antd';
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fileApi } from '../../../apis/fileApi';
import { callActions, IAppStore } from '../../../store';
import { sendMessage } from '../../../store/chat/chatReducer';
import FileUploadPreviews from './FileUploadPreviews';

const ChatInput = () => {
    const dispatch = useDispatch();
    const { selectedConversationId } = useSelector((store: IAppStore) => store.chat);
    const [messageText, setMessageText] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onSendMessage = useCallback(() => {
        if (!messageText?.trim()) {
            return;
        }
        console.log({ messageText })
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
        console.log('onFileInputChanged', files)
        var uploadResponse = await fileApi.uploadFiles(Array.from(files), (progressEvent) => {
            console.log('upload_file', progressEvent.loaded, progressEvent)
        }, 'message');

        if (!uploadResponse.isSuccess) {
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
            files: uploadedFiles
        }))
    }, [])
    return (
        <div>
            {/* <FileUploadPreviews /> */}
            <div className='chat-input'>
                <div>
                    <input type="file" multiple ref={fileInputRef} className="display-none"
                        onChange={onFileInputChanged} />
                    <FontAwesomeIcon icon={faPaperclip} className="input-button clickable"
                        onClick={() => onUploadFiles('file')} />
                    <FontAwesomeIcon icon={faImages} className="input-button clickable"
                        onClick={() => onUploadFiles('image')} />
                    <FontAwesomeIcon icon={faPhotoVideo} className="input-button clickable"
                        onClick={() => onUploadFiles('video')} />
                </div>
                <div className='text-input'>
                    <Input value={messageText}
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