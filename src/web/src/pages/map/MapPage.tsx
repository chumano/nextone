import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import '../../styles/pages/map/map.scss';
import { MapProvider, useMapDispatch, useMapSelector } from '../../context/map/mapContext';
import MapView from './MapView';
import MapSideBar from './MapSideBar';
import MapToolBar from './MapToolBar';
import { comApi } from '../../apis/comApi';
import { mapActions } from '../../context/map/mapStore';
import { EventInfo } from '../../models/event/Event.model';
import { Modal } from 'antd';

const MapPageInternal: React.FC = () => {
    const dispatch = useMapDispatch();
    const { selectedEventTypeCodes } = useMapSelector(o => o)
    const fetchEvents = useCallback(async () => {
        if(!selectedEventTypeCodes) return;
        console.log("fetchEvents", selectedEventTypeCodes)
        const response = await comApi.getEventsForMap({ eventTypeCodes: selectedEventTypeCodes});
        if (!response.isSuccess) {
            return;
        }
        dispatch(mapActions.setEvents(response.data));
    }, [comApi, dispatch, mapActions, selectedEventTypeCodes])

    const fetchUsers = useCallback(async () => {
        const response = await comApi.getOnlineUsersForMap({});
        if (!response.isSuccess) {
            return;
        }
        dispatch(mapActions.setOnlineUsers(response.data));
    }, [comApi, dispatch, mapActions])

    useEffect(() => {
        fetchEvents();
        fetchUsers();
    }, [comApi, dispatch, mapActions, selectedEventTypeCodes]);

    useEffect(() => {
        return ()=>{
            dispatch(mapActions.clearSelectedObjects());
        }
    },[dispatch, mapActions.clearSelectedObjects]);
    
    useEffect(() => {
        const intervalCall = setInterval(() => {
            fetchEvents();
            fetchUsers();
        }, 60 * 1000);
        return () => {
          clearInterval(intervalCall);
        };
      }, []);

      const onDeleteEvent = useCallback((item: EventInfo) => {
        Modal.confirm({
            title: `Bạn có muốn xóa sự kiện không?`,
            onOk: async () => {
                const response = await comApi.deleteEvent(item.id);

                if (!response.isSuccess) {
                    Modal.error({
                        title: 'Không thể xóa sự kiện',
                        content: response.errorMessage
                      });
                    return;
                }

                dispatch(mapActions.deleteEvent({
                    eventId: item.id
                }));
            },
            onCancel() {
            },
        });
        
    },[dispatch]);
    return (
        <div className="map-page">
            <MapView onDeleteEvent={onDeleteEvent}/>

            <MapToolBar />

            <MapSideBar onDeleteEvent={onDeleteEvent}/>

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

