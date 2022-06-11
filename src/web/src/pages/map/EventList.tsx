import React from 'react'
import { EventInfo } from '../../models/event/Event.model';

const EventList = () => {
    const events: EventInfo[] = [];
    return <div className='events'>
        {events.length === 0 &&
            <h6>Không có sự kiện</h6>
        }
        {events.map(o => <>
            Evet
        </>)}
    </div>
}

export default EventList