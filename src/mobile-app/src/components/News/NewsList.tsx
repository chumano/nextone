import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getList} from '../../stores/news';
import Loading from '../Loading';
import NewsItem from './NewsItem';

const NewsList = () => {
  const {data, allLoaded, newsLoading, newsOffset, status} = useSelector(
    (state: IAppStore) => state.news,
  );
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getList({params: {offset: 0, publishState: 0}}));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(getList({params: {offset: 0, publishState: 0}}));
    return () => {};
  }, []);

  const loadMoreResults = useCallback(() => {
    if (newsLoading || allLoaded) return;

    dispatch(
      getList({params: {offset: newsOffset, publishState: 0}, loadMore: true}),
    );
  }, [newsLoading, allLoaded, newsOffset]);

  if (status === 'loading') return <Loading />;

  return (
    <FlatList
      refreshing={false}
      style={styles.newsListContainer}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <NewsItem item={item} />}
      onRefresh={() => onRefresh()}
      onEndReached={() => loadMoreResults()}
    />
  );
};

export default NewsList;

const styles = StyleSheet.create({
  newsListContainer: {
    padding: 8,
  },
});
