import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';

import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import {DetailsScreenNavigationProp} from '../../navigation/HomeStack';
import {notificationApi} from '../../apis/notificationApi';
import {IAppStore} from '../../stores/app.store';
import {useSelector} from 'react-redux';
import NewsList from '../../components/News/NewsList';

export const HomeScreen = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const onDetailScreenHandler = () => {
    navigation.navigate('DetailsScreen');
  };

  const onDisplayNotification = async () => {
    // Create a channel
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });

    // // Display a notification
    // await notifee.displayNotification({
    //   title: 'Notification Title',
    //   body: 'Main body content of the notification',
    //   android: {
    //     channelId: channelId,
    //     smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
    //   },
    // });

    //call myself
    const response = await notificationApi.testCall(userInfo!.userId);
    console.log('testCall', response);
  };
  return (
    <View style={styles.homeScreenContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.text}>Hệ thống chỉ huy, điều hành thống nhất</Text>
        <Image source={require('../../assets/intro_img.png')} />
      </View>

      {/* <Button title="Test" onPress={onDisplayNotification} /> */}
      <View style={styles.newsListContainer}>
        <View style={styles.newsListContainer}>
          <NewsList />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  newsListContainer: {
    flex: 1
  },
  textHeader: {
    color: '#000',
    fontSize: 32,
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
});
