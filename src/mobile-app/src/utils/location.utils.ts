
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { getDistanceFromLatLonInM, LatLngType } from './mapUtils';
const LOCATION_WATCH_ID = 'LOCATION_WATCH_ID';
export const LOCATION = 'LOCATION';

//https://dev-yakuza.posstree.com/en/react-native/react-native-geolocation-service/
export const setupLocationWatch = (
    calback: (newLatLng: LatLngType) => void
) => {
    if (Platform.OS === "android") {
        requestLocationPermission(() => {
            _setupLocationWatch(calback);
        });
    } else {
        _setupLocationWatch(calback);
    }
};

const _setupLocationWatch = async (
    calback: (newLatLng: LatLngType) => void
) => {
    const locationWatchIdString = await AsyncStorage.getItem(LOCATION_WATCH_ID);
    if (locationWatchIdString) {
        Geolocation.clearWatch(parseInt(locationWatchIdString));
    }

    const locationWatchId = Geolocation.watchPosition(
        async position => {
            const newLatLng: LatLngType = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };

            const latestPositionString = await AsyncStorage.getItem(LOCATION);

            if (latestPositionString) {
                const latestPosition = JSON.parse(latestPositionString);
                const latestLatLng: LatLngType = {
                    lat: latestPosition.lon,
                    lon: latestPosition.lon
                };
            }
           
            await AsyncStorage.setItem(LOCATION, JSON.stringify(newLatLng));
            calback(newLatLng);
        },
        (error) => {
            //console.log(error)
        },
        {
            enableHighAccuracy: true,
            interval: 30000,
            fastestInterval: 2000,
            distanceFilter: 5 //m 
        }
    );

    await AsyncStorage.setItem(LOCATION_WATCH_ID, locationWatchId.toString());
};


export const requestLocationPermission = async (
    onSuccess: Function,
    onError?: Function
) => {
    let granted: any = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (granted) {
        onSuccess();
    } else {
        granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            onSuccess();
        } else {
            if (onError) onError();
        }
    }
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }

  if (status === 'disabled') {
    Alert.alert(
      `Turn on Location Services to allow "Ucom" to determine your location.`,
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }

  return false;
};

export {hasLocationPermission, hasPermissionIOS};
