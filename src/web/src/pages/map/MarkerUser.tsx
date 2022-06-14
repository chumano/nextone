import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet';
import userIconUrl from '../../assets/images/map/user-icon.png';
import { UserStatus } from '../../models/user/UserStatus.model';
const userIcon = L.icon({
    iconUrl: userIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined
});

const MarkerUserInternal: React.FC<{ user: UserStatus, openPopup?: boolean }> = ({ user, openPopup }) => {
    const map = useMap();
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef<L.Popup>();

    useEffect(() => {
        if (refReady && openPopup) {
            popupRef.current!.openOn(map);
        }
    }, [openPopup, refReady, map]);

    return <Marker icon={userIcon} position={[user.lastLat!, user.lastLon!]}>
        <Popup
            ref={(r) => {
                popupRef.current = r as L.Popup;
                setRefReady(true);
            }}>
            <h6>{user.userName}</h6>
            {user.lastUpdateDate}
        </Popup>
    </Marker>
}

const MarkerUser = React.memo(MarkerUserInternal)
export default MarkerUser