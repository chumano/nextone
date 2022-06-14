import React, { useCallback, useEffect } from 'react'
import { useMapDispatch, useMapSelector } from '../../context/map/mapContext';
import { EventInfo } from '../../models/event/Event.model';
import { NotificationOutlined } from '@ant-design/icons';
import { showModalEvent } from '../../components/event/ModalEvent';
import { mapActions } from '../../context/map/mapStore';

interface EventViewItemProps{
    eventItem : EventInfo,
    onClick?: ()=>void
}
const EventViewItem : React.FC<EventViewItemProps> = ({eventItem, onClick})=>{
    const eventIcon = '';
    return  <div  className="event-container">
    <div className="event--icon">
        {eventIcon &&
            <img src={eventIcon}/>
        }
        {!eventIcon &&
            <NotificationOutlined style={{ color: 'black', fontSize: '20px' }} />
        }
        
    </div>
    <div className="event-body clickable" onClick={onClick} >
        <div className="event--type">
            {eventItem.eventType.name}
        </div>
        <div className="event--content">
            {eventItem.content}
        </div>
        <div className="event__bottom">
            <div className="event--sender">
                {eventItem.userSender.userName}
            </div>
            <div className="event--time">
                {eventItem.occurDate}
            </div>
        </div>
    </div>
   
</div>
}
const EventList = () => {
    const events = useMapSelector(o=>o.events);
    const dispatch = useMapDispatch();
    const onEventClick = useCallback((evt: EventInfo)=>{
        return ()=>{
            dispatch(mapActions.selectEvent(evt));
        }
    },[dispatch,mapActions.selectEvent])

    return <div className='event-list'>
        {events.length === 0 &&
            <h6>Không có sự kiện</h6>
        }
        {events.map(o => <EventViewItem key={o.id} eventItem={o} onClick={onEventClick(o)}/>)}
    </div>
}

export default EventList