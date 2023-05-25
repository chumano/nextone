import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import NewsList from '../../components/News/NewsList';
import {APP_THEME} from '../../constants/app.theme';

const NewsScreen = () => {
  return (
    <View style={styles.newsScreenContainer}>
      <View style={styles.cardContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Hệ thống chỉ huy, điều hành thống nhất
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={require('../../assets/intro_img.png')} />
        </View>
      </View>
      <View style={styles.newsListContainer}>
        <Text style={styles.newsText}>Tin tức gần đây</Text>
        <NewsList />
      </View>
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  newsScreenContainer: {
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
