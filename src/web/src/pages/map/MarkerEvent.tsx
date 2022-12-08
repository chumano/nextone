import { Button } from 'antd';
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet';
import eventIconUrl from '../../assets/images/map/event-icon.png';
import { showModalEvent } from '../../components/event/ModalEvent';
import { EventInfo } from '../../models/event/Event.model';
const eventIcon = L.icon({
    iconUrl: eventIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined
});

interface MarkerEventProps{
    evt: EventInfo, 
    openPopup?: boolean
}
const MarkerEventInternal: React.FC<MarkerEventProps> = ({ evt, openPopup }) => {
    const map = useMap();
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef<L.Popup>();

    useEffect(() => {
        if (refReady && openPopup) {
            popupRef.current!.openOn(map);
        }
    }, [openPopup, refReady, map]);

    return <Marker icon={eventIcon} position={[evt.lat, evt.lon]}>
        <Popup
            ref={(r) => {
                popupRef.current = r as L.Popup;
                setRefReady(true);
            }}>
            <div className='clickable' onClick={()=>{
                showModalEvent(evt)
            }}>
                <h6>{evt.eventType.name}</h6>
                {evt.content}
                <div>{evt.userSender.userName} : {evt.occurDate}</div>
            </div>

        </Popup>
    </Marker>
}

const MarkerEvent = React.memo(MarkerEventInternal)
export default MarkerEvent