import React, { useCallback, useEffect,useLayoutEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { conversationApi } from '../../apis';
import { eventApi } from '../../apis/event.api';
import Loading from '../../components/Loading';
import { MapStackProps } from '../../navigation/MapStack';
import { EventInfo } from '../../types/Event/EventInfo.type';
import { UserStatus } from '../../types/User/UserStatus.type';
import MapView from './MapView';


const MapScreen = ({navigation, route}: MapStackProps)=> {

  const [loading, setLoading] = useState(true);
  const [selectedEventTypeCodes,_] = useState<string[]>([]);
  const [eventInfos,setEventInfos] = useState<EventInfo[]>()
  const [users,setUsers] = useState<UserStatus[]>();
  const [zoomPosition, setZoomPosition] = useState<[number,number]>();

  useLayoutEffect(() => {
    const params: any = route.params;
    if (!params) return;
    console.log("MAPSCREEN params", params)
    const {position} = params
    if(position){
      setZoomPosition([position[0], position[1]]);
    }
  }, [navigation, route, setZoomPosition]);

  // load events, users
  const fetchEvents = useCallback(async () => {
    if (!selectedEventTypeCodes) return;

    const response = await eventApi.getEventsForMap({ eventTypeCodes: selectedEventTypeCodes });
    if (!response.isSuccess) {
      return;
    }
    setEventInfos(response.data);
  }, [eventApi, dispatch, selectedEventTypeCodes])

  const fetchUsers = useCallback(async () => {
    const response = await conversationApi.getOnlineUsersForMap({});
    if (!response.isSuccess) {
      return;
    }
    setUsers(response.data);
  }, [conversationApi, dispatch])

  useEffect(() => {
    console.log("[init] fectch data")
    const fetchData = async ()=>{
      await fetchEvents();
      await fetchUsers();
    }
    fetchData();
  }, [fetchEvents, fetchUsers]);

  useEffect(() => {
    const intervalCall = setInterval(async () => {
        console.log("[interval] fectch data")
        await fetchEvents();
        await fetchUsers();
    }, 60 * 1000);
    return () => {
      clearInterval(intervalCall);
    };
  }, []);

  const onMapInited = useCallback(()=>{
    setLoading(false);
  },[setLoading])

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {loading && <Loading />}
      <MapView 
        zoomPosition={zoomPosition}
        eventInfos={eventInfos}
        users={users}
        onMapInited={onMapInited}
      />

      <FAB
        style={styles.floatBtn}
        small
        icon="plus"
        onPress={() => console.log('Pressed')}
      />
    </View>
  );
};

export default MapScreen;


const styles = StyleSheet.create({
  floatBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
});

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
