import { EventInfo } from "../../models/event/Event.model";
import { NotificationOutlined } from '@ant-design/icons';
import { showModalEvent } from "../event/ModalEvent";
import { Button } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

interface EventViewProp{
    eventItem: EventInfo,
    canDelete?: boolean,
    onDelete?:()=>void
}
const EventView :React.FC<EventViewProp> = ({eventItem, canDelete, onDelete})=>{
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
            <div className="event-body "  >
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div className="event--type clickable" onClick={()=>{
                        showModalEvent(eventItem);
                    }}>
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
    </>
}

export default EventView;