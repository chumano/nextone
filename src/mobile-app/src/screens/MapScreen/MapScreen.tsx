import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {FAB} from 'react-native-paper';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {conversationApi} from '../../apis';
import {eventApi} from '../../apis/event.api';
import Loading from '../../components/Loading';
import {MapStackProps} from '../../navigation/MapStack';
import {EventInfo} from '../../types/Event/EventInfo.type';
import {UserStatus} from '../../types/User/UserStatus.type';
import MapView from './MapView';
import Geolocation from 'react-native-geolocation-service';
import {IAppStore} from '../../stores/app.store';
import {useSelector} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const MapScreen = ({navigation, route}: MapStackProps) => {
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const [loading, setLoading] = useState(true);
  const [selectedEventTypeCodes, _] = useState<string[]>([]);
  const [eventInfos, setEventInfos] = useState<EventInfo[]>();
  const [users, setUsers] = useState<UserStatus[]>();
  const [zoomPosition, setZoomPosition] = useState<[number, number]>();
  const [myLocation, setMyLocation] = useState<[number, number]>();
  useLayoutEffect(() => {
    const params: any = route.params;
    if (!params) return;
    console.log('MAPSCREEN params', params);
    const {position} = params;
    if (position) {
      setZoomPosition([position[0], position[1]]);
    }
  }, [navigation, route, setZoomPosition]);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('always');
      } else {
        const permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log('permissionStatus', permissionStatus);
      }
    };
    requestPermission();
  }, []);

  useFocusEffect(useCallback(() => {
    console.log("Map screen is focused") 
    return () => {
      console.log("Map screen is outfocused") 
    };
  }, []));

  // load events, users
  const fetchEvents = useCallback(async () => {
    if (!selectedEventTypeCodes) return;

    const response = await eventApi.getEventsForMap({
      eventTypeCodes: selectedEventTypeCodes,
    });
    if (!response.isSuccess) {
      return;
    }
    setEventInfos(response.data);
  }, [eventApi, dispatch, selectedEventTypeCodes]);

  const fetchUsers = useCallback(async () => {
    const response = await conversationApi.getOnlineUsersForMap({});
    if (!response.isSuccess) {
      return;
    }
    const users = response.data.filter(o => o.userId != userInfo?.userId);
    setUsers(users);
  }, [conversationApi, dispatch, userInfo]);

  useEffect(() => {
    console.log('[init] fectch data');
    const fetchData = async () => {
      await fetchEvents();
      await fetchUsers();
    };
    fetchData();
  }, [fetchEvents, fetchUsers]);

  useEffect(() => {
    const intervalCall = setInterval(async () => {
      console.log('[interval] fectch data');
      await fetchEvents();
      await fetchUsers();
    }, 60 * 1000);
    return () => {
      clearInterval(intervalCall);
    };
  }, [fetchEvents, fetchUsers]);

  useEffect(() => {
    if (!myLocation) return;
    conversationApi.updateMyStatus({
      lat: myLocation[0],
      lon: myLocation[1],
    });
  }, [myLocation]);

  const onMapInited = useCallback(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [setLoading]);

  const showMyLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('showMyLocation', position);
        setMyLocation([latitude, longitude]);
        setZoomPosition([latitude, longitude]);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [setMyLocation]);

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <MapView
        currentPosition={myLocation}
        zoomPosition={zoomPosition}
        eventInfos={eventInfos}
        users={users}
        onMapInited={onMapInited}
      />

      {loading && <Loading />}

      <FAB style={styles.floatBtn} small icon="plus" onPress={showMyLocation} />
    </SafeAreaView>
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
