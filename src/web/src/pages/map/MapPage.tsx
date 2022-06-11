import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import '../../styles/pages/map/map.scss';
import { Button, Select } from 'antd';
import { MapProvider } from '../../context/map/mapContext';
import MapView from './MapView';
import MapSideBar from './MapSideBar';

const MapPageInternal: React.FC = () => {
    useEffect(() => {
        //fetchEvents
        //fetchUsers
    }, []);

    return (
        <div className="map-page">
            <MapView />

            <div className='map-toolbar map-overlay'>
                <div className=' map-overlay__content'>
                    Tool bar
                    <Select style={{ width: 300 }} placeholder='Loại sự kiện'
                        value='all'>
                        <Select.Option key='all' value='all'>Tất cả</Select.Option>
                    </Select>
                </div>
            </div>
            
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

