import React from "react";
import {channel_events} from "./fakedata";
import eventIcon from '../../assets/logo.png';


const ChannelEvents :React.FC = ()=>{
    const events = channel_events;
    return <>
        <div className="channel-events">
            <div className="channel-events__header">
                <h5>Sự cố gần đây (20)</h5>
            </div>
            <div className="channel-events__body">
                {events.map(eventItem=>(
                    <div key={eventItem.id}>
                        <EventView eventItem={eventItem}></EventView>
                    </div>
                ))}
            </div>
        </div>
    </>
}

interface EventViewProp{
    eventItem: Event
}
const EventView :React.FC<EventViewProp> = ({eventItem})=>{
    return <>
        <div  className="event-container">
            <div className="event--icon">
                <img src={eventIcon}/>
            </div>
            <div className="event-body">
                <div className="event--type">
                    {eventItem.type}
                </div>
                <div className="event--content">
                    {eventItem.content}
                </div>
                <div className="event__bottom">
                    <div className="event--sender">
                        {eventItem.sender}
                    </div>
                    <div className="event--time">
                        {eventItem.occurDate}
                    </div>
                </div>
            </div>
           
        </div>
    </>
}

interface Event {
    id:string,
    type: string,
    content: string,
    occurDate: string,
    sender:string
}
 

export default ChannelEvents;