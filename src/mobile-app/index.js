/**
 * @format
 */

import { AppRegistry, AppState, Linking, NativeModules, Platform } from 'react-native';
import 'react-native-get-random-values'
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import bgMessaging from './bgMessaging';
import { Navigation } from 'react-native-navigation';
import { APP_THEME } from './src/constants/app.theme';


AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNCallKeepBackgroundMessage', () => async ({ name, callUUID, handle }) => {
    //console.log('RNCallKeepBackgroundMessage', { name, callUUID, handle })
    //Linking.openURL(`ucom://call/outgoing/${callUUID}/${handle}/${name}`)
    return Promise.resolve();
});

//firebase background
messaging().setBackgroundMessageHandler(bgMessaging);


Navigation.events().registerAppLaunchedListener(async () => {
    if(__DEV__) console.log('registerAppLaunchedListener')
    var JavascriptAndNativeErrorHandler = require('./src/utils/error_handling').default;
    JavascriptAndNativeErrorHandler?.initializeErrorHandling();

    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: appName,
                            options: {
                               
                                statusBar: {
                                    visible: true,
                                    backgroundColor: APP_THEME.colors.background,
                                },
                                topBar: {
                                    visible: false,
                                    height: 0
                                },
                            },
                        }
                    }
                ]
            }
        }
    });
});
