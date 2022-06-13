import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import '../../styles/pages/map/map.scss';
import { MapProvider, useMapDispatch } from '../../context/map/mapContext';
import MapView from './MapView';
import MapSideBar from './MapSideBar';
import MapToolBar from './MapToolBar';
import { comApi } from '../../apis/comApi';
import { mapActions } from '../../context/map/mapStore';

const MapPageInternal: React.FC = () => {
    const dispatch = useMapDispatch();
    const fetchEvents = useCallback(async ()=>{
        const response = await comApi.getEventsForMap({ eventTypeCodes: []});
        if(!response.isSuccess){
            return;
        }
        dispatch(mapActions.setEvents(response.data));
    },[comApi, dispatch, mapActions])

    const fetchUsers = useCallback(async ()=>{
        const response = await comApi.getOnlineUsersForMap({ });
        if(!response.isSuccess){
            return;
        }
        dispatch(mapActions.setOnlineUsers(response.data));
    }, [comApi, dispatch, mapActions])
    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, [comApi, dispatch, mapActions]);

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

