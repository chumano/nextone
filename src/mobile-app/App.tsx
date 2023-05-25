import qs from 'qs';
import jwtDecode from 'jwt-decode';

import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Provider as PaperProvider} from 'react-native-paper';
import {APP_THEME} from './src/constants/app.theme';
import {Provider as StoreProvider, useDispatch, useSelector} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';

import {AppDispatch, appStore, IAppStore} from './src/stores/app.store';
import {authActions} from './src/stores/auth';

import {UserTokenInfoResponse} from './src/types/Auth/Auth.type';
import {JWTDecodeInfo} from './src/types/Auth/JWTDecodeInfo.type';

import RootApp from './src/RootApp';

import Loading from './src/components/Loading';
import {Alert, Linking, Platform, StatusBar} from 'react-native';
import {enableScreens} from 'react-native-screens';
import PublicScreen from './src/screens/PublicScreen/PublicScreen';
import {IGlobalData} from './src/types/AppConfig.type';
import {conversationApi} from './src/apis';
import {GlobalContext} from './AppContext';
import signalRService from './src/services/SignalRService';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const AppContainer = () => {
  const {isUserLogin} = useSelector((store: IAppStore) => store.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [globalData, setGlobalData] = useState<IGlobalData>({});

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const getUserInfoFromStorage = async () => {
      try {
        setIsLoading(true);
        const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
        if (userTokenInfoString) {
          const userTokenObject = qs.parse(
            userTokenInfoString,
          ) as unknown as UserTokenInfoResponse;
          const jwtDecodeInfo = jwtDecode(
            userTokenObject.access_token,
          ) as JWTDecodeInfo;

          dispatch(
            authActions.loginWithStorage({
              accessToken: userTokenObject.access_token,
              expiresIn: userTokenObject.expire_in,
              refreshToken: userTokenObject.refresh_token,
              scope: userTokenObject.scope,
              tokenType: userTokenObject.token_type,
              userId: jwtDecodeInfo.sub,
            }),
          );
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    getUserInfoFromStorage();
  }, [dispatch]);

  // fix error weird behavior on IOS navigation with display none on bottom tabs
  useEffect(() => {
    if (Platform.OS === 'ios') {
      enableScreens(false);
    }
  }, []);

  useEffect(() => {
    if (!isUserLogin) {
      signalRService.disconnectHub();
      return;
    }
    const fetchApplicationSettings = async () => {
      try {
        //console.log('fetchApplicationSettings...')
        const response = await conversationApi.getAppSettings();
        if (!response.isSuccess) {
          Alert.alert('Không thể lấy thông tin hệ thống');
          return;
        }
        if (response.data.iceServers) {
          response.data.iceServers = response.data.iceServers.map(o => {
            if (!o.username) {
              delete o.username;
            }
            if (!o.credential) {
              delete o.credential;
            }
            return o;
          });
        }
        //console.log('fetchApplicationSettings...',  response.data.iceServers)
        setGlobalData({
          applicationSettings: response.data,
        });
      } catch (err) {
        console.error('fetchApplicationSettings', err);
        Alert.alert('Có lỗi', 'Không thể lấy thông tin hệ thống');
      }
    };
    fetchApplicationSettings();
  }, [isUserLogin]);

  if (isLoading) {
    return <Loading />;
  }

  const isShowLoginScreen = !isUserLogin;
  const isShowRootAppScreen = isUserLogin;

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        {isShowLoginScreen && <PublicScreen />}
        {isShowRootAppScreen && (
          <GlobalContext.Provider value={globalData}>
            <RootApp />
          </GlobalContext.Provider>
        )}
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <StoreProvider store={appStore}>
        <PaperProvider theme={APP_THEME}>
          <AppContainer />
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default App;

const useDeepLink = () => {
  useEffect(() => {
    const getLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      //console.log('Linking initialUrl', initialUrl);
      //console.log('AppState.currentState', AppState.currentState)
    };
    getLink();
  }, []);
};
