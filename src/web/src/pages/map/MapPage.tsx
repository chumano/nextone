import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import '../../styles/pages/map/map.scss';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: icon,
    shadowUrl: iconShadow
});

const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 500)
    }, []);
    return null;
};
const defaultCenter: L.LatLngTuple = [51.505, -0.09];
const defaultZoom = 13

//https://react-leaflet.js.org/docs/start-introduction/
const MapPage: React.FC = () => {
    const [map, setMap] = useState<L.Map | undefined>(undefined);
    const [position, setPosition] = useState<L.LatLng | undefined>(undefined);

    const resetMap = useCallback(() => {
        map?.setView(defaultCenter, defaultZoom)
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

    useEffect(() => {
    }, []);

    return (
        <div className="map-page">
            <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}
                whenCreated={setMap}>
                <ResizeMap />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
            <div>
                <p>
                    latitude: {position?.lat?.toFixed(4)}, longitude: {position?.lng?.toFixed(4)}{' '}
                    <button onClick={resetMap}>reset</button>
                </p>
            </div>
        </div>
    )
}


export default MapPage;

