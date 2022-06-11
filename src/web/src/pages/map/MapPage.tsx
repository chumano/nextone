import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import '../../styles/pages/map/map.scss';
import { MapProvider } from '../../context/map/mapContext';
import MapView from './MapView';
import MapSideBar from './MapSideBar';
import MapToolBar from './MapToolBar';

const MapPageInternal: React.FC = () => {
    useEffect(() => {
        //fetchEvents
        //fetchUsers
    }, []);

    return (
        <div className="map-page">
            <MapView />

            <MapToolBar/>
            
            <MapSideBar />

            {/* <div>
                <p>
                    latitude: {position?.lat?.toFixed(4)}, longitude: {position?.lng?.toFixed(4)}{' '}
                    <button onClick={resetMap}>reset</button>
                </p>
            </div> */}
        </div>
    )
}

const MapPage = () => <MapProvider>
    <MapPageInternal />
</MapProvider>

export default MapPage;

