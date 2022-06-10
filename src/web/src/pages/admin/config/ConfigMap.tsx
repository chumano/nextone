import React, { useCallback, useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { mapApi } from '../../../apis/mapApi'
import { MapInfo } from '../../../models/map/Map.modal'

const MapController = () => {
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

const ConfigMap = () => {
    const [maps, setMaps] = useState<MapInfo[]>([])
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
        const fetchMaps = async () => {
            const maps = await mapApi.getMaps()
            setMaps(maps);
        }

        fetchMaps();
    }, [])
    return (
        <div className='config-map'>
            <h5>Cấu hình bản đồ</h5>
            <div>
                <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}
                    whenCreated={setMap}>
                    <MapController />
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
            </div>
            {maps.map(o =>
                <>
                    <div className="map-item">
                        <div className="map-item__img-container">
                            <img src={o.imageUrl} alt="map image" />
                        </div>
                        {o.name}
                        <div>
                            {o.latestTileUrl}
                        </div>
                    </div>

                </>
            )}
        </div>
    )
}

export default ConfigMap