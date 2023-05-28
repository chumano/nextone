import React from 'react';
import {Image, Linking, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {APP_CONFIG} from '../../constants/app.config';
import {APP_THEME} from '../../constants/app.theme';
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
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.dateText}>{item.publishedDate}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text
          style={styles.viewMoreText}
          onPress={() =>
            Linking.openURL(`${APP_CONFIG.WEBAPP}/news/${item.id}/tin-tuc`)
          }>
          Xem thêm
        </Text>
      </View>
    </View>
  );
};

export default NewsItem;

const styles = StyleSheet.create({
  newsContainer: {
    flexDirection: 'row',
    borderBottomColor: `${APP_THEME.colors.black}3a`,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  imageContainer: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  descriptionContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  titleText: {
    marginBottom: APP_THEME.spacing.between_component,
    fontWeight: '600',
    lineHeight: 18,
    fontSize: 16,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '100',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'justify',
    marginBottom: 4,
  },
  viewMoreText: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '500',
    color: APP_THEME.colors.accent,
  },
});
