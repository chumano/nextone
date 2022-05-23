
import React, { Fragment } from 'react';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { appStore, IAppStore } from './src/stores/appStore';
import RootApp from './src/RootApp';
import { useSelector } from 'react-redux';
import { AppState } from 'react-native';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import { CallScreen } from './src/screens/CallScreen/CallScreen';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

const AppContainer = () => {
  const { isLogined } = useSelector((store: IAppStore) => store.auth);
  const { isCalling } = useSelector((store: IAppStore) => store.call);
  console.log({ isLogined })
  return (
    <NavigationContainer>
      {!isLogined &&!isCalling &&
        <LoginScreen />
      }
      {isLogined && !isCalling &&
        <RootApp />
      }

      {isCalling &&
        <CallScreen />
      }
    </NavigationContainer>
  )
};

const App = () => {
  return <StoreProvider store={appStore}>
    <PaperProvider theme={appTheme}>
      <AppContainer />
    </PaperProvider>
  </StoreProvider>
}

export default App;
