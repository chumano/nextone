import classNames from 'classnames';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '../../../models/message/Message.model'
import { MessageType } from '../../../models/message/MessageType.model';
import { IAppStore } from '../../../store';
import { frowNow } from '../../../utils/functions';
import FileView from '../file/FileView';
import MessageEvent from './MessageEvent';
import MessageItemUpload, { MessageUpload } from './MessageItemUpload';
import {PhoneOutlined } from '@ant-design/icons'



interface MessageItemProps {
    message: Message
}
const InternalMessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const isOwner = user?.profile.sub == message.userSender.userId;
    console.log('MessageItem rendering...', message)

    const displayDate = frowNow(message.sentDate);
    const properties = message.properites;
    const gotoMapLocation = (location:[number, number])=>{
        window.location.href = `/map?lat=${location[0]}&lon=${location[1]}` ;
    }
    return <>
        {message.type == MessageType.Event &&
            <div className="message-item">
                <MessageEvent message={message} />
            </div>
        }

        {message.type !== MessageType.Event &&
            <div className={classNames({
                'message-item': true,
                'owner': isOwner,
                'other': !isOwner
            })}
            >
                {!isOwner &&
                    <div className='message-sender'>
                        {message.userSender.userName}
                    </div>
                }
                <div className='message-content'>
                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                        {(message.type===MessageType.CallMessage) && <PhoneOutlined  style={{marginRight:10}} className={'call-icon start'}/> }
                        {(message.type===MessageType.CallEndMessage) && <PhoneOutlined  style={{marginRight:10}} className={'call-icon end'}/> }
                        {message.content}
                    </div>
                    {properties && properties['LOCATION'] &&
                    <div>
                        Vị trí: <a href='void()' onClick={()=>gotoMapLocation(properties['LOCATION']!)}>
                            [{properties['LOCATION']![0].toFixed(2)}, {properties['LOCATION']![1].toFixed(2)}]
                            </a>
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
                            {message.files.map(o =>
                                <FileView key={o.fileId} file={o} />
                            )}
                        </div>
                    }
                    <span className='message-time'>
                        {displayDate}
                    </span>
                </div>

            </div>
        }
    </>
}

const MessageItem = React.memo(InternalMessageItem);

export default MessageItem
