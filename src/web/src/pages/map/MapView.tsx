import L from 'leaflet';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from 'react-leaflet'
import { comApi } from '../../apis/comApi';
import API from '../../config/apis';
import { MapConfig, parseMapConfig } from '../../utils/functions';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';

import eventIconUrl from '../../assets/logo.png';
import MapDisplayPosition from '../../components/map/MapPositionDisplay';
import { useMapSelector } from '../../context/map/mapContext';

//default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: icon,
    shadowUrl: iconShadow
});

const eventIcon = L.icon({
    iconUrl: eventIconUrl,
    iconSize: [32,32],
    iconAnchor: [16, 32],
    popupAnchor: [0,0],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined
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

const MapView = () => {
    const { onlineUsers, events } = useMapSelector(o => o);
    const [map, setMap] = useState<L.Map | undefined>(undefined);
    const [position, setPosition] = useState<L.LatLng | undefined>(undefined);

    const layerRef = useRef<L.TileLayer>(null);
    const [mapConfig, setMapConfig] = useState<MapConfig>();
    const [mapTileUrl, setMapTileUrl] = useState<string>();

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

    useEffect(() => {
        fetchSettings();
    }, [])

    useEffect(() => {
        if (layerRef.current && mapTileUrl) {
            layerRef.current.setUrl(mapTileUrl);
        }
    }, [mapTileUrl, layerRef.current])

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
    return <>
        {mapConfig &&
            <MapContainer center={mapConfig.center}
                zoom={mapConfig.zoom} minZoom={mapConfig.minZoom} maxZoom={mapConfig.maxZoom}
                maxBounds={mapConfig.boundingBox}
                scrollWheelZoom={true}
                zoomControl={false}
                whenCreated={setMap}>
                <MapController />
                <ZoomControl position="topright" />
                <MapDisplayPosition controlPosition='bottomright' />

                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapTileUrl &&
                    <TileLayer tms={true} url={mapTileUrl} />
                }

                {onlineUsers.filter(o => o.lastLat != null && o.lastLon != null)
                    .map(o => <Marker icon={eventIcon} key={'user_' + o.userId} position={[o.lastLat!, o.lastLon!]}>
                            <Popup>
                                <h6>{o.userName}</h6>
                                {o.lastUpdateDate}
                            </Popup>
                        </Marker>
                    )}

                {events.filter(o => o.lat != null && o.lon != null)
                    .map(o => <Marker key={'event_' + o.id} position={[o.lat!, o.lon!]}>
                            <Popup>
                                <h6>{o.eventType.name}</h6>
                                {o.content}
                            </Popup>
                        </Marker>
                    )}


            </MapContainer>
        }
    </>
}

export default MapView