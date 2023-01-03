import { NotificationOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import React, { useMemo, useState } from 'react'
import { EventFile } from '../../../models/event/EventFile.model';
import { FileType } from '../../../models/file/FileType.model';
import { Message } from '../../../models/message/Message.model'
import { frowNow, groupFileByType } from '../../../utils/functions';
import { showModalEvent } from '../../event/ModalEvent';
import FileView from '../file/FileView';
import { DeleteOutlined } from '@ant-design/icons';


interface MessageEventProps {
    message: Message,
    canDelete?: boolean,
    onDelete?: () => void
}
const MessageEvent: React.FC<MessageEventProps> = ({ message, canDelete, onDelete }) => {
    const eventInfo = message.event!;

    const group = useMemo(() => {
        return groupFileByType(eventInfo?.files || []);
    }, [eventInfo])

    const [isHovering, setIsHovering] = useState(false);
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const displayDate = frowNow(message.sentDate);
    if(!eventInfo){
        return <div title={message.id}>Đã bị xóa</div>
    }
    return (
        <div className='message-event' onMouseOver={handleMouseOver} onMouseLeave={handleMouseOut}>
            <div>
                <NotificationOutlined style={{ color: 'black', fontSize: '30px' }} />
                <span style={{ marginLeft: 10 }}>{eventInfo.eventType.name}</span>
                {isHovering && canDelete &&
                    <span style={{ marginLeft: 10, display:'inline-block' }}>
                        <Button size="small" danger className='button-icon'
                            onClick={onDelete} title="Xóa sự kiện">
                            <DeleteOutlined />
                        </Button>
                    </span>
                }
            </div>
            <div>
                <h6 className='clickable' onClick={() => {
                    showModalEvent(eventInfo);
                }}> {eventInfo.content}
                </h6>
            </div>

            <div>
                <span className='event-sender'>{eventInfo.userSender.userName}</span>
                {' - '}
                <span className='event-time'>{eventInfo.occurDate}</span>
            </div>

            {eventInfo.files && eventInfo.files.length > 0 &&
                <div className='message-event__files'>
                    {group['image'].length > 0 &&
                        <Image.PreviewGroup>
                            <div className='message-event__files-image'>
                                {group['image'].map(o =>
                                    <div key={'image' + o.fileId} className='message-event__files-item'>
                                        <FileView file={o} hiddenName={true} />
                                    </div>
                                )}
                            </div>
                        </Image.PreviewGroup>
                    }
                    {group['other'].length > 0 &&
                        <div className='message-event__files-other'>
                            {group['other'].map(o =>
                                <div key={'image' + o.fileId} className='message-event__files-item'>
                                    <FileView key={'file' + o.fileId} file={o} hiddenName={true} />
                                    <div className='message-event__files-item-name'>
                                        {o.fileName}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </div>
            }
            <span className='message-time'>{displayDate}</span>
        </div>
    )
}

export default React.memo(MessageEvent)