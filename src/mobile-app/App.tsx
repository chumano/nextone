import React, {useLayoutEffect} from 'react';
import qs from 'qs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Provider as PaperProvider} from 'react-native-paper';
import {APP_THEME} from './src/constants/app.theme';
import {Provider as StoreProvider, useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';

import {authActions} from './src/stores/auth/auth.reducer';

import {NavigationContainer} from '@react-navigation/native';

import {AppDispatch, appStore, IAppStore} from './src/stores/app.store';

import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import {CallScreen} from './src/screens/CallScreen/CallScreen';

import {UserTokenInfo} from './src/types/Auth.type';

import RootApp from './src/RootApp';

const AppContainer = () => {
  const {IsUserLogin} = useSelector((store: IAppStore) => store.auth);
  const {isCalling} = useSelector((store: IAppStore) => store.call);

  const dispatch: AppDispatch = useDispatch();

  useLayoutEffect(() => {
    const getUserInfoFromStorage = async () => {
      const userTokenInfoString = await AsyncStorage.getItem('@UserToken');

      if (userTokenInfoString) {
        const userTokenObject = qs.parse(
          userTokenInfoString,
        ) as unknown as UserTokenInfo;

        dispatch(authActions.loginWithStorage(userTokenObject));
      }
    };

    getUserInfoFromStorage();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {!IsUserLogin && !isCalling && <LoginScreen />}
      {IsUserLogin && !isCalling && <RootApp />}

      {isCalling && <CallScreen />}
    </NavigationContainer>
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
