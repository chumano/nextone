import { Button } from 'antd';
import L from 'leaflet';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet';
import defaultUserIconUrl from '../../assets/images/map/user-icon.png';
import { UserStatus } from '../../models/user/UserStatus.model';
import { MessageOutlined } from '@ant-design/icons';



const MarkerUserInternal: React.FC<{ 
    user: UserStatus, 
    openPopup?: boolean ,
    userIconUrl?: string ,
    openConversation?:()=>void
}> = ({ user,userIconUrl =defaultUserIconUrl ,  openPopup, openConversation }) => {
    
    const map = useMap();
    const [refReady, setRefReady] = useState(false);
    let popupRef = useRef<L.Popup>();

    useEffect(() => {
        if (refReady && openPopup) {
            popupRef.current!.openOn(map);
        }
    }, [openPopup, refReady, map]);

    const userIcon = useMemo(()=> L.icon({
        iconUrl: userIconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: undefined,
        shadowSize: undefined,
        shadowAnchor: undefined
    }) ,[userIconUrl]);

    return <Marker icon={userIcon} position={[user.lastLat!, user.lastLon!]}>
        <Popup
            ref={(r) => {
                popupRef.current = r as L.Popup;
                setRefReady(true);
            }}>
            <h6>{user.userName}</h6>
            {user.lastUpdateDate}
            
            <div>
                    <Button className='button-icon' icon={ <MessageOutlined />}
                        onClick={openConversation} >
                        Liên lạc
                    </Button>
                </div>
        </Popup>
    </Marker>
}

const MarkerUser = React.memo(MarkerUserInternal)
export default MarkerUser