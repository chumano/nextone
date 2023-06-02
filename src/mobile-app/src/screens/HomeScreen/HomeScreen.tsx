import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DetailsScreenNavigationProp} from '../../navigation/HomeStack';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {useDispatch, useSelector} from 'react-redux';
import NewsList from '../../components/News/NewsList';
import {APP_THEME} from '../../constants/app.theme';
// import Sentry from '@sentry/react-native'

export const HomeScreen = () => {
  const dispatch: AppDispatch = useDispatch();
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
    //const response = await notificationApi.testCall(userInfo!.userId);
    //console.log('testCall', response);
  };

  return (
    <View style={styles.homeScreenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Hệ thống chỉ huy, điều hành thống nhất
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/intro_img.png')} />
        </View>

        {/* <Button title='Try!' onPress={ () => { throw new Error('First error') }}/>
        <Button title='Native!' onPress={ () => { Sentry.nativeCrash(); }}/> */}
      </View>

      {/* <Button title="Test" onPress={onDisplayNotification} /> */}
      <View style={styles.newsListContainer}>
        <Text style={styles.newsText}>Tin tức gần đây</Text>
        <NewsList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
  },

  cardContainer: {
    paddingHorizontal: APP_THEME.spacing.padding,
    shadowOpacity: 1,
    shadowRadius: APP_THEME.rounded,
    shadowOffset: {
      width: 6,
      height: 6,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.accent,
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: APP_THEME.spacing.between_component,
  },

  text: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '500',
    color: APP_THEME.colors.primary,
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    left: -18,
  },

  newsListContainer: {
    flex: 1,
    marginVertical: APP_THEME.spacing.between_component,
  },

  newsText: {
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 24,
    color: APP_THEME.colors.text,
    margin: APP_THEME.spacing.between_component,
  },
});
