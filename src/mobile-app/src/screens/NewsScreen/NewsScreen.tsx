import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import NewsList from '../../components/News/NewsList';

const NewsScreen = () => {
  return (
    <SafeAreaView style={styles.newsScreenContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.text}>Hệ thống chỉ huy, điều hành thống nhất</Text>
        <Image source={require('../../assets/intro_img.png')} />
      </View>
      <View style={styles.newsListContainer}>
        <NewsList></NewsList>
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  newsScreenContainer: {
    flex: 1,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  newsListContainer: {
    flex: 1,
  },
  text: {},
});
