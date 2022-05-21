import React from "react";
import eventIcon from '../../assets/logo.png';
import { EventInfo } from "../../models/event/Event.model";
import EventView from "./EventView";

interface ChannelEventsProps{
    events: EventInfo[]
}
const ChannelEvents :React.FC<ChannelEventsProps> = ({events})=>{
    return <>
        <div className="channel-events">
            <div className="channel-events__header">
                <h5>Sự kiện gần đây
                     {events.length> 0  && <>({events.length})</>}
                </h5>
            </div>
            <div className="channel-events__body">
                {events.map(eventItem=>(
                    <div key={eventItem.id}>
                        <EventView eventItem={eventItem}></EventView>
                    </div>
                ))}

                {events.length ==0 &&
                    <div>
                        Không có sự cố
                    </div>
                }
            </div>
        </div>
    </>
}

export default ChannelEvents;