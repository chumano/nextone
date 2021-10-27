import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import 'react-chat-elements/dist/main.css';

import userIcon from '../../assets/logo.png';
import {
    ChatItem, MessageBox, MeetingMessage, MessageList,
    ChatList, Input, Popup, Dropdown,
    Avatar, MeetingItem, MeetingList
} from 'react-chat-elements';
import {
    faPhone,
    faVideo,
    faInfoCircle,
    faPaperclip,
    faImage,
    faImages,
    faFileVideo,
    faVideoSlash,
    faPhotoVideo,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { messageList } from "../chat/fakedate";

interface ChatModalProp{
    isShow : boolean
}
const ChatModal: React.FC<ChatModalProp> = ({isShow}) => {
    const [isMinimize, setIsMinimize] = useState(isShow);
    useEffect(()=>{
        setIsMinimize(!isShow);
    },[isShow])

    const onClose = ()=>{
        setIsMinimize(true);
    }

    return <>
        <div className={"chat-modal" + (isMinimize?" display-none": "")}>
            <div className="chat-modal__header">
                <div className="user-icon">
                    <img src={userIcon} />
                </div>
                <div className="user-name">
                    Loc Hoang
                </div>
                <div className="flex-spacer"></div>

                <div className="tools">
                    <span className="tools-item clickable">
                        <FontAwesomeIcon icon={faPhone} />
                    </span>
                    <span className="tools-item clickable">
                        <FontAwesomeIcon icon={faVideo} />
                    </span>
                    <span className="tools-item clickable" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
            </div>
            <div className="chat-modal__body">
                <MessageList className='message-list'
                    lockable={true}
                    toBottomHeight={'100%'}
                    dataSource={messageList} />
            </div>
            <div className="chat-modal__bottom">
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
    </>
}

export default ChatModal;