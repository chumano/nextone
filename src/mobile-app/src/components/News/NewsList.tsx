import React from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {IAppStore} from '../../stores/app.store';
import Loading from '../Loading';
import NewsItem from './NewsItem';

const NewsList = () => {
  const newsState = useSelector((state: IAppStore) => state.news);

  if (newsState.status === 'loading') return <Loading />;

  return (
    <FlatList
      data={newsState.data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <NewsItem item={item} />}
    />
  );
};

export default NewsList;
