import React from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import { APP_CONFIG } from '../../constants/app.config';
import {News} from '../../types/News/News.type';

interface IProps {
  item: News;
}

const NewsItem: React.FC<IProps> = ({item}) => {
  return (
    <View style={styles.newsContainer}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item.imageUrl}} />
      </View>
      <View style={styles.textContainer}>
        <Text>{item.title}</Text>
        <Text>{item.publishedDate}</Text>
        <View style={styles.descriptionContainer}>
          <Text numberOfLines={2}>{item.description}</Text>
        </View>
        <Text onPress={() => Linking.openURL(`${APP_CONFIG.WEBAPP}/news/${item.id}/tin-tuc`)}>View more...</Text>
      </View>
    </View>
  );
};

export default NewsItem;

const styles = StyleSheet.create({
  newsContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  imageContainer: {},
  textContainer: {
    flex: 1,
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
  },
});
