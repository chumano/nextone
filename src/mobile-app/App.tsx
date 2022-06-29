import qs from 'qs';
import jwtDecode from 'jwt-decode';

import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Provider as PaperProvider} from 'react-native-paper';
import {APP_THEME} from './src/constants/app.theme';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';

import {AppDispatch, appStore, IAppStore} from './src/stores/app.store';
import {authActions} from './src/stores/auth';

import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import {CallScreen} from './src/screens/CallScreen/CallScreen';

import {UserTokenInfoResponse} from './src/types/Auth/Auth.type';
import {JWTDecodeInfo} from './src/types/Auth/JWTDecodeInfo.type';

import RootApp from './src/RootApp';

import Loading from './src/components/Loading';
import {DeviceEventEmitter, Linking, PermissionsAndroid, Platform} from 'react-native';
import {enableScreens} from 'react-native-screens';

const AppContainer = () => {
  const {isUserLogin} = useSelector((store: IAppStore) => store.auth);
  const {isCalling} = useSelector((store: IAppStore) => store.call);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  useEffect(()=>{
    const getLink = async()=>{
      const initialUrl = await Linking.getInitialURL();
      console.log('initialUrl', initialUrl)
    }
    getLink();
  },[])

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

  const isShowLoginScreen = !isUserLogin && !isCalling;
  const isShowRootAppScreen = isUserLogin ;
  const isShowCallScreen = isCalling;

  if (isLoading) return <Loading />;

  return (
    <>
      <NavigationContainer>
        {isShowLoginScreen && <LoginScreen />}
        {isShowRootAppScreen && <RootApp />}
        {isShowCallScreen && <CallScreen />}
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <StoreProvider store={appStore}>
      <PaperProvider theme={APP_THEME}>
        <AppContainer />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
