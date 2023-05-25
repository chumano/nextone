import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {APP_THEME} from '../constants/app.theme';

const Loading = () => {
  return (
    <View style={styles.activityOverlayStyle}>
      <View style={styles.activityIndicatorContainer}>
        <ActivityIndicator animating={true} color={APP_THEME.colors.accent} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
  },
  activityIndicatorContainer: {
    backgroundColor: APP_THEME.colors.primary,
    padding: 8,
    borderRadius: 9999,
    alignSelf: 'center',
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: APP_THEME.colors.backdrop,
    shadowRadius: APP_THEME.rounded,
    shadowOpacity: 1,
  },
});

export default Loading;
