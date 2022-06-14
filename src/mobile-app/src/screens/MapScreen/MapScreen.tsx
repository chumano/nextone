import React, {useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';
import WebView from 'react-native-webview';
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
  const [loading, setLoading] = useState(true);
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <WebView
        originWhitelist={['*']}
        // source={{ uri: 'https://google.com' }}
        source={LEAFLET_HTML_SOURCE}
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
