import classNames from 'classnames';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '../../../models/message/Message.model'
import { MessageType } from '../../../models/message/MessageType.model';
import { IAppStore } from '../../../store';
import FileView from '../file/FileView';
import MessageEvent from './MessageEvent';

interface MessageItemProps {
    message: Message
}
const InternalMessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const dispatch = useDispatch();
    const user = useSelector((store: IAppStore) => store.auth.user);
    const isOwner = user?.profile.sub == message.userSender.userId;
    console.log('MessageItem rendering...', message.id)
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
                    <div>
                        {message.content}
                    </div>

                    {message.files && message.files.length > 0 &&
                        <div className='message-files'>
                            {message.files.map(o =>
                                <FileView key={o.fileId} file={o}/>
                            )}
                        </div>
                    }
                    <span className='message-time'>{message.sentDate}</span>
                </div>

            </div>
        }
    </>
}

const MessageItem = React.memo(InternalMessageItem);

export default MessageItem