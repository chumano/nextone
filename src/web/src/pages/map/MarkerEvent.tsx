import { Button, Tag } from 'antd';
import L from 'leaflet';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet';
import defaultEventIconUrl from '../../assets/images/map/event-icon.png';
import { showModalEvent } from '../../components/event/ModalEvent';
import { EventInfo } from '../../models/event/Event.model';


interface MarkerEventProps{
    evt: EventInfo, 
    eventIconUrl?: string ,
    openPopup?: boolean
}
const MarkerEventInternal: React.FC<MarkerEventProps> = ({ 
    evt,
    eventIconUrl = defaultEventIconUrl, 
    openPopup }) => {
    const map = useMap();
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef<L.Popup>();

    useEffect(() => {
        if (refReady && openPopup) {
            popupRef.current!.openOn(map);
        }
    }, [openPopup, refReady, map]);

    const eventIcon = useMemo(()=> L.icon({
        iconUrl: eventIconUrl,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
        shadowUrl: undefined,
        shadowSize: undefined,
        shadowAnchor: undefined
    }),[eventIconUrl]);

    return <Marker icon={eventIcon} position={[evt.lat, evt.lon]}>
        <Popup
            ref={(r) => {
                popupRef.current = r as L.Popup;
                setRefReady(true);
            }}>
            <div >
                <h6 className='clickable' 
                    onClick={()=>{
                        showModalEvent(evt)
                    }}>{evt.eventType.name}
                </h6>
                <hr style={{margin:'0.5rem 0'}}/>
                {evt.content}
                <hr style={{margin:'0.5rem 0'}}/>
                <div><Tag>{evt.userSender.userName}</Tag>  {evt.occurDate}</div>
            </div>

        </Popup>
    </Marker>
}

const MarkerEvent = React.memo(MarkerEventInternal)
export default MarkerEvent