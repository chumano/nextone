import { Modal, Image } from 'antd'
import React, { useMemo } from 'react';
import { NotificationOutlined } from '@ant-design/icons';
import { EventInfo } from '../../models/event/Event.model'
import { groupFileByType } from '../../utils/functions';
import FileView from '../chat/file/FileView';

interface ModalEventProps {
  eventInfo: EventInfo
}
export const ModalEvent: React.FC<ModalEventProps> = ({ eventInfo }) => {
  const group = useMemo(() => {
    return groupFileByType(eventInfo?.files || []);
  }, [eventInfo])

  return <div className='message-event'>
    <div>
      <NotificationOutlined style={{ color: 'black', fontSize: '30px' }} />
      <span style={{ marginLeft: 10 }}>{eventInfo.eventType.name}</span>
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
                  <FileView file={o} />
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
  </div>
}


export const showModalEvent = (evt: EventInfo) => {
  Modal.info({
    title: 'Thông tin sự kiện - ' + evt.eventType.name,
    width: '800px',
    content: <ModalEvent eventInfo={evt} />
  })
}