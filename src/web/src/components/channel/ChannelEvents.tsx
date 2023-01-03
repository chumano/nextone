import React from "react";
import { useDispatch, useSelector } from "react-redux";
import eventIcon from '../../assets/logo.png';
import { Channel } from "../../models/channel/Channel.model";
import { MemberRole } from "../../models/conversation/ConversationMember.model";
import { EventInfo } from "../../models/event/Event.model";
import { chatActions } from "../../store/chat/chatReducer";
import EventView from "./EventView";

interface ChannelEventsProps{
    channel: Channel,
    userRole?: MemberRole,
    onDeleteEvent?: (item: EventInfo)=> void
}
const ChannelEvents :React.FC<ChannelEventsProps> = ({channel,userRole, onDeleteEvent})=>{
    const dispatch = useDispatch();
    const {events} = channel;
    
    return <>
        <div className="channel-events">
            <div className="channel-events__header">
                <h5>Sự kiện gần đây
                     {events.length> 0  && <>({events.length})</>}
                </h5>
            </div>
            <div className="channel-events__body">
                {events.map(eventItem=>(
                <>
                    <div key={eventItem.id}>
                        <EventView eventItem={eventItem} canDelete={userRole===MemberRole.MANAGER}
                            onDelete={()=>{onDeleteEvent && onDeleteEvent(eventItem)}}
                        />
                    </div>
                    <hr/>
                </>
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