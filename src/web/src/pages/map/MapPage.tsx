import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
import { GlobalContext } from '../../utils/contexts/AppContext';
import { AppWindow } from '../../config/AppWindow';
declare let window: AppWindow;

const MapPageInternal: React.FC = () => {
    const dispatch = useMapDispatch();
    const globalData = useContext(GlobalContext)
    const { selectedEventTypeCodes } = useMapSelector(o => o)
    const fetchEvents = useCallback(async () => {
        if(!selectedEventTypeCodes) return;
        //console.log("fetchEvents", selectedEventTypeCodes)
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
    }, [fetchEvents, fetchUsers]);

    useEffect(() => {
        return ()=>{
            dispatch(mapActions.clearSelectedObjects());
        }
    },[dispatch, mapActions.clearSelectedObjects]);
    
    useEffect(() => {
        const interval = window.ENV?.Map?.mapMonitorRefreshEventsIntervalInSeconds  || 60;
        const intervalCall = setInterval(() => {
            fetchEvents();
        }, interval*1000);
        return () => {
          clearInterval(intervalCall);
        };
    }, [fetchEvents]);

    useEffect(() => {
        const interval = window.ENV?.Map?.mapMonitorRefreshUserssIntervalInSeconds  || 60;
        const intervalCall = setInterval(() => {
            fetchUsers();
        }, interval*1000);
        return () => {
          clearInterval(intervalCall);
        };
    }, [ fetchUsers]);

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

