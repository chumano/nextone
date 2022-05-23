
import React from 'react';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { appStore } from './src/stores/appStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import ChatScreen from './src/screens/ChatScreen/ChatScreen';
import AppNavigationBar from './src/components/AppNavigationBar';


const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    accent: 'yellow',
  },
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <StoreProvider store={appStore}>
      <PaperProvider theme={appTheme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: (props) => <AppNavigationBar {...props} />,
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  )
};

export default App;
