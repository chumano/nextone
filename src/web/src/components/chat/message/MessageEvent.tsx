import { NotificationOutlined} from '@ant-design/icons';
import React from 'react'
import { Message } from '../../../models/message/Message.model'
import FileView from '../file/FileView';

interface MessageEventProps {
    message: Message
}
const MessageEvent: React.FC<MessageEventProps> = ({ message }) => {
    const eventInfo = message.event!;
    return (
        <div className='message-event'>
            <div>
                <NotificationOutlined style={{ color: 'black', fontSize: '30px' }} />
            </div>
            <div>
                {eventInfo.eventTypeCode} -
                {eventInfo.content}

            </div>

            <div>
                <span className='event-sender'>{eventInfo.userSender.userName}</span>
                -
                <span className='message-time'>{eventInfo.occurDate}</span>
            </div>

            <div className='message-event__files'>
                {eventInfo.files.map(o =>
                    <FileView key={o.fileId} file={o}/>
                )}
            </div>

        </div>
    )
}

export default MessageEvent