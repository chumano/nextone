import React, {useCallback, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Loading from '../../components/Loading';
//https://github.com/pavel-corsaghin/react-native-leaflet/blob/main/src/LeafletView/index.tsx
const LEAFLET_HTML_SOURCE = Platform.select({
  ios: require('../../../android/app/src/main/assets/leaflet.html'),
  android: {uri: 'file:///android_asset/leaflet.html'},
});
const styles = StyleSheet.create({
  floatBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
});

const MapScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const sendMessage = useCallback(
    (payload: any) => {
      console.log(`sending: ${JSON.stringify(payload)}`);

      webViewRef.current?.injectJavaScript(
        `window.postMessage(${JSON.stringify(payload)}, '*');`
      );
    },
    []
  );

  const sendInitialMessage = useCallback(() => {
    let startupMessage: any = {};
    // if (mapLayers) {
    //   startupMessage.mapLayers = mapLayers;
    // }
    // if (mapMarkers) {
    //   startupMessage.mapMarkers = mapMarkers;
    // }
    // if (mapCenterPosition) {
    //   startupMessage.mapCenterPosition = mapCenterPosition;
    // }
    // if (mapShapes) {
    //   startupMessage.mapShapes = mapShapes;
    // }
    // if (ownPositionMarker) {
    //   startupMessage.ownPositionMarker = {
    //     ...ownPositionMarker,
    //     id: OWN_POSTION_MARKER_ID,
    //   };
    // }
    // startupMessage.zoom = zoom;
    sendMessage(startupMessage);
    setInitialized(true);
    console.log('sending initial message');
  }, [sendMessage]);


  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const msg = event?.nativeEvent?.data;
      if (!msg) {
        return;
      }
      const message: { 
        type: 'MAP_READY' | 'ON_VIEW',
        data: any
      } = JSON.parse(msg);
      console.log(`received: ${JSON.stringify(message)}`);

      if (message.type === 'MAP_READY') {
        sendInitialMessage();
      }
      if (message.type === 'ON_VIEW') {
        
      }
  }, [sendInitialMessage]);
  return (
    <View style={{flex: 1, position: 'relative'}}>

      <WebView
        originWhitelist={['*']}
        source={LEAFLET_HTML_SOURCE}
        ref={webViewRef}
        javaScriptEnabled={true}

        style={{position: 'relative'}}

        onLoadStart={() => {
          console.log('WebView-onLoadStart');
          setLoading(true);
        }}
        onLoad={() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }}
        onMessage={handleMessage}
      />

      <FAB
        style={styles.floatBtn}
        small
        icon="plus"
        onPress={() => console.log('Pressed')}
      />
      {loading && <Loading />}
    </View>
  );
};

export default MapScreen;
