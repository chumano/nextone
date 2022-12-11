import React, { useCallback, useEffect } from 'react'
import { useMapDispatch, useMapSelector } from '../../context/map/mapContext';
import { EventInfo } from '../../models/event/Event.model';
import { NotificationOutlined } from '@ant-design/icons';
import { showModalEvent } from '../../components/event/ModalEvent';
import { mapActions } from '../../context/map/mapStore';
import { Button } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { IAppStore } from '../../store';

interface EventViewItemProps{
    eventItem : EventInfo,
    onClick?: ()=>void,
    canDelete?: boolean,
    onDelete?: ()=>void
}
const EventViewItem : React.FC<EventViewItemProps> = ({eventItem, onClick, canDelete, onDelete})=>{
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
    <div className="event-body" >
        <div style={{display:'flex', flexDirection:'row'}}>
            <div className="event--type clickable" onClick={onClick} >
                {eventItem.eventType.name}
            </div>
            <div className="flex-spacer"></div>
            {canDelete &&
                <Button size="small" danger className='button-icon' 
                    onClick={onDelete} title="Xóa sự kiện">
                    <DeleteOutlined />
                </Button>
            }
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
const EventList: React.FC<{
    onDeleteEvent?: (item: EventInfo) =>void;
}>  = ({onDeleteEvent}) => {
    const events = useMapSelector(o=>o.events);
    const user = useSelector((store: IAppStore) => store.auth.user);
    const systemUserRole = user?.profile.role as string;
    const canDeleteEvent = systemUserRole==='admin' || systemUserRole==='manager';
    
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
        {events.map(o => <EventViewItem key={o.id} eventItem={o} 
            canDelete={canDeleteEvent} onDelete={()=> onDeleteEvent && onDeleteEvent(o)}
            onClick={onEventClick(o)}/>)}
    </div>
}

export default EventList