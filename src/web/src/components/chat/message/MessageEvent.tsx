import { NotificationOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import React, { useMemo } from 'react'
import { EventFile } from '../../../models/event/EventFile.model';
import { FileType } from '../../../models/file/FileType.model';
import { Message } from '../../../models/message/Message.model'
import { frowNow } from '../../../utils/functions';
import { showModalEvent } from '../../event/ModalEvent';
import FileView from '../file/FileView';

const groupFileByType = (files: EventFile[]) => {
    let group: { 'image': EventFile[], 'other': EventFile[] } = { 'image': [], 'other': [] };
    for (const file of files) {
        if (file.fileType == FileType.Image) {
            group['image'].push(file);
        } else {
            group['other'].push(file);
        }
    }
    return group;
}
interface MessageEventProps {
    message: Message
}
const MessageEvent: React.FC<MessageEventProps> = ({ message }) => {
    const eventInfo = message.event!;

    const group = useMemo(() => {
        return groupFileByType(eventInfo?.files || []);
    }, [eventInfo])

    const displayDate = frowNow(message.sentDate);
    return (
        <div className='message-event'>
            <div>
                <NotificationOutlined style={{ color: 'black', fontSize: '30px' }} />
                <span style={{ marginLeft: 10 }}>{eventInfo.eventType.name}</span>
            </div>
            <div>
                <h6 className='clickable' onClick={()=>{
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
                                <div key={'image'+o.fileId} className='message-event__files-item'>
                                    <FileView  file={o} />
                                </div>
                            )}
                        </div>
                        </Image.PreviewGroup>
                    }
                    {group['other'].length > 0 &&
                        <div className='message-event__files-other'>
                            {group['other'].map(o =>
                                <div key={'image'+o.fileId} className='message-event__files-item'>
                                    <FileView key={'file'+o.fileId} file={o} hiddenName={true} />
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