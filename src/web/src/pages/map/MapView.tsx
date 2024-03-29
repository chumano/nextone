import L from 'leaflet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { comApi } from '../../apis/comApi';
import API from '../../config/apis';
import { MapConfig, parseMapConfig } from '../../utils/functions';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';


import MapDisplayPosition from '../../components/map/MapPositionDisplay';
import { useMapSelector } from '../../context/map/mapContext';
import { message } from 'antd';
import MarkerUser from './MarkerUser';
import MarkerEvent from './MarkerEvent';
import ModalSendLocation from './ModalSendLocation';
import { AppWindow } from '../../config/AppWindow';
import { useHistory } from 'react-router-dom';
import { UserStatus } from '../../models/user/UserStatus.model';
import { EventInfo } from '../../models/event/Event.model';

declare let window: AppWindow;
//default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: icon,
    shadowUrl: iconShadow
});


const MapController = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500)
    }, []);
    return null;
};

//https://react-leaflet.js.org/docs/start-introduction/
const zoomObjectLvl = 15;
const MapView : React.FC<{
    onDeleteEvent?: (item: EventInfo) =>void;
}> = ({onDeleteEvent})=>{
    const history = useHistory();
    const { onlineUsers, events, 
        selectedEvent, selectedUser 
    } = useMapSelector(o => o);
    const [map, setMap] = useState<L.Map | undefined>(undefined);
    const [position, setPosition] = useState<L.LatLng | undefined>(undefined);

    const layerRef = useRef<L.TileLayer>(null);
    const [mapConfig, setMapConfig] = useState<MapConfig>();
    const [mapTileUrl, setMapTileUrl] = useState<string>();

    const [modalSendLocationVisible, setModalSendLocationVisible] = useState(false);
    const [selectedLatLon, setSelectedLatLon] = useState<L.LatLng>();
    const [searchType, setSearchType] = useState<'users'|'near'>('users');

    const fetchSettings = useCallback(async () => {
        const resposne = await comApi.getSettings();
        if (resposne.isSuccess) {
            const appSettings = resposne.data;
            const mapConfig = parseMapConfig(appSettings);
            setMapConfig(mapConfig);

            if (mapConfig.layers.length > 0) {
                const { url } = mapConfig.layers[0];
                const tileMapUrl = API.MAP_SERVICE + url;
                setMapTileUrl(tileMapUrl);
            }
        }

    }, [comApi]);

    
    useEffect(()=>{
        const params = new URLSearchParams(window.location.search)
        const {lat,lon} = {lat: params.get('lat'), lon: params.get('lon')};
        if(!lat || !lon || !map) return;
        //zoom to position
        map.flyTo([parseFloat(lat),parseFloat(lon)], zoomObjectLvl)
    },[window.location.search,map])

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings])

    useEffect(() => {
        if (layerRef.current && mapTileUrl) {
            layerRef.current.setUrl(mapTileUrl);
        }
    }, [mapTileUrl, layerRef.current])


    useEffect(() => {
        if (!map) return;
       
        if (selectedEvent) {
            const latlon: L.LatLngTuple = [selectedEvent.lat, selectedEvent.lon];
            map.flyTo(latlon, zoomObjectLvl)
        }

        if (selectedUser) {
            if (!selectedUser.lastLat || !selectedUser.lastLon) {
                message.info("Không có thông tin tọa độ");
                return;
            }
            const latlon: L.LatLngTuple = [selectedUser.lastLat, selectedUser.lastLon];
            map.flyTo(latlon, zoomObjectLvl)
        }
    }, [map, selectedEvent, selectedUser])


    const resetMap = useCallback(() => {
        // map?.setView(defaultCenter, defaultZoom)
    }, [map]);

    const onMove = useCallback(() => {
        setPosition(map?.getCenter())
    }, [map]);

    useEffect(() => {
        map?.on('move', onMove)
        return () => {
            map?.off('move', onMove)
        }
    }, [map, onMove])

    const openConversation = useCallback((user: UserStatus)=>{
        return ()=>{
            history.push('/chat', 
            { 
                'action': 'openConversation',
                'user': user
            } as any)
        }
    },[])

    const renderUserMarkers = useMemo(() => {
        return <>
            {onlineUsers.filter(o => o.lastLat != null && o.lastLon != null)
                .map(o => <MarkerUser key={'user_' + o.userId} user={o}
                    openConversation={openConversation(o)}
                    openPopup={selectedUser && selectedUser.userId === o.userId} />
                )}
        </>
    }, [onlineUsers, selectedUser, openConversation])

    const renderEventMarkers = useMemo(() => {
        return <>
            {events.filter(o => o.lat != null && o.lon != null)
                .map(o => <MarkerEvent key={'event_' + o.id}  evt={o}
                    openPopup={selectedEvent && selectedEvent.id === o.id} />
                )}
        </>
    }, [events, selectedEvent, onDeleteEvent])

    const onSendLocation = useCallback((latlon: L.LatLng, searchType: 'users' | 'near') => {
       setSearchType(searchType);
       setSelectedLatLon(latlon);
       setModalSendLocationVisible(true)
    }, []);

    return <>
        {mapConfig &&
            <MapContainer center={mapConfig.center}
                zoom={mapConfig.zoom} minZoom={mapConfig.minZoom} maxZoom={mapConfig.maxZoom}
                maxBounds={mapConfig.boundingBox}
                scrollWheelZoom={true}
                zoomControl={false}
                whenCreated={setMap}
                contextmenu={true}
                contextmenuItems={[
                    {
                      text: 'Gửi tin nhắn vị trí',
                      callback: (e:any)=>{
                        onSendLocation(e.latlng, 'users')
                      }
                    },
                    {
                        text: 'Tìm quanh đây',
                        callback: (e:any)=>{
                          onSendLocation(e.latlng, 'near')
                        }
                      }
                  ]}>
                <MapController />
                <ZoomControl position="topright" />
                <MapDisplayPosition controlPosition='bottomright' />

                <TileLayer attribution=''
                    url={window.ENV.Map.baseMapUrl}
                />

                {mapTileUrl &&
                    <TileLayer tms={true} url={mapTileUrl} />
                }

                {renderUserMarkers}
                {renderEventMarkers}

            </MapContainer>
        }
        {modalSendLocationVisible &&
            <ModalSendLocation 
                searchType={searchType}
                position={[selectedLatLon!.lat, selectedLatLon!.lng]} onVisible={(visible)=>{
                setModalSendLocationVisible(visible)
            }} />
        }
    </>
}

export default MapView