import classNames from 'classnames';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '../../../models/message/Message.model'
import { MessageType } from '../../../models/message/MessageType.model';
import { IAppStore } from '../../../store';
import { frowNow } from '../../../utils/functions';
import FileView from '../file/FileView';
import MessageEvent from './MessageEvent';
import MessageItemUpload, { MessageUpload } from './MessageItemUpload';
import {PhoneOutlined } from '@ant-design/icons'
import { FileType } from '../../../models/file/FileType.model';
import AudioPlayer from '../../player/AudioPlayer';
import { MemberRole } from '../../../models/conversation/ConversationMember.model';
import { Button } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';



interface MessageItemProps {
    message: Message,
    onPlaying?: (id: string)=>void,
    playingId?: string,
    userRole?: MemberRole,
    onDeleteEvent?: ()=>void,
    onDeleteMessage?: ()=>void
}
const InternalMessageItem: React.FC<MessageItemProps> = ({ message, onPlaying, playingId, userRole, 
    onDeleteEvent, onDeleteMessage}) => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const isOwner = user?.profile.sub == message.userSender.userId;
    const {isDeleted} = message;    

    const displayDate = frowNow(message.sentDate);
    const properties = message.properites;
    const location = properties? (properties['LOCATION'] || properties['location']): undefined;
    const gotoMapLocation = (location:[number, number])=>{
        window.location.href = `/map?lat=${location[0]}&lon=${location[1]}` ;
    }

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const canDeleteMessage = isOwner || userRole == MemberRole.MANAGER;
    return <>
        {message.type == MessageType.Event &&
            <div className="message-item">
                <MessageEvent message={message} canDelete={userRole===MemberRole.MANAGER} 
                    onDelete={onDeleteEvent}/>
            </div>
        }

        {message.type !== MessageType.Event &&
            <div className={classNames({
                    'message-item': true,
                    'owner': isOwner,
                    'other': !isOwner,
                    'deleted': isDeleted
                })}
                onMouseLeave={handleMouseOut}
            >
                {!isOwner &&
                    <div className='message-sender'>
                        {message.userSender.userName}
                    </div>
                }

                {!isDeleted && <>
                    <div className='message-content'  onMouseOver={handleMouseOver}>
                        <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                            {(message.type===MessageType.CallMessage) && <PhoneOutlined  style={{marginRight:10}} className={'call-icon start'}/> }
                            {(message.type===MessageType.CallEndMessage) && <PhoneOutlined  style={{marginRight:10}} className={'call-icon end'}/> }
                            {message.content}
                        </div>
                        {location &&
                        <div>
                            Vị trí: <Button onClick={()=>gotoMapLocation(location)}>
                                [{location[0].toFixed(2)}, {location[1].toFixed(2)}]
                                </Button>
                        </div>
                        }

                        {message.state == 'upload' &&
                            <MessageItemUpload message={message as MessageUpload} />
                        }
                        {message.state == 'error' &&
                        <div>Có lỗi</div>
                        }

                        {message.files && message.files.length > 0 &&
                            <div className='message-files'>
                                {message.files.map(o => {
                                    if(o.fileType === FileType.Audio) 
                                    return <AudioPlayer  key={o.fileId}  id={o.fileId}  playingId={playingId}
                                    durationMiliSeconds={undefined} 
                                    url={o.fileUrl} onPlaying={onPlaying}/>

                                    return  <FileView key={o.fileId} file={o} hiddenName={true}/>
                                })}
                            </div>
                        }
                        <span className='message-time'>
                            {displayDate}
                        </span>
                    </div>

                    {isHovering && <span className='message-item-actions'>
                        <Button title='Xóa tin nhắn' disabled={!canDeleteMessage} danger size='small' 
                            onClick={onDeleteMessage}
                            icon={<DeleteOutlined />}/>
                    </span>
                    }
                </>}

                {isDeleted && 
                    <div className='message-content'>
                        <div>
                            Tin nhắn đã bị xóa
                        </div>
                        <span className='message-time'>
                            {displayDate}
                        </span>
                    </div>
                }

            </div>
        }
    </>
}

const MessageItem = React.memo(InternalMessageItem);

export default MessageItem
