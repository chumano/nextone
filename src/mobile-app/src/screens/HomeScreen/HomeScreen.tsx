import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';

import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import {DetailsScreenNavigationProp} from '../../navigation/HomeStack';

export const HomeScreen = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const onDetailScreenHandler = () => {
    navigation.navigate('DetailsScreen');
  };

  const onDisplayNotification = async ()=> {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      },
    });
  }
  return (
    <View style={styles.homeScreenContainer}>
      <Text style={styles.textHeader}>UCOM</Text>
      <Text style={styles.text}>Hệ thống chỉ huy, điều hành thống nhất</Text>
      <Image source={require('../../assets/intro_img.png')} />
     
      <Button title="Test" onPress={onDisplayNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  textHeader: {
    color: '#000',
    fontSize: 32
  },
  text: {
    color: '#000',
    fontSize: 18
  },
  homeScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
