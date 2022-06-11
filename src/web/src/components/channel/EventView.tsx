import { EventInfo } from "../../models/event/Event.model";
import { NotificationOutlined } from '@ant-design/icons';
import { showModalEvent } from "../event/ModalEvent";

interface EventViewProp{
    eventItem: EventInfo
}
const EventView :React.FC<EventViewProp> = ({eventItem})=>{
    const eventIcon = '';
    return <>
        <div  className="event-container">
            <div className="event--icon">
                {eventIcon &&
                    <img src={eventIcon}/>
                }
                {!eventIcon &&
                    <NotificationOutlined style={{ color: 'black', fontSize: '20px' }} />
                }
                
            </div>
            <div className="event-body clickable" onClick={()=>{
                showModalEvent(eventItem);
            }} >
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
    </>
}

export default EventView;