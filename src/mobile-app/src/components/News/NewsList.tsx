import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, IAppStore} from '../../stores/app.store';
import {getList} from '../../stores/news';
import Loading from '../Loading';
import NewsItem from './NewsItem';
import {APP_THEME} from '../../constants/app.theme';

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
    if (newsLoading || allLoaded) {
      return;
    }

    dispatch(
      getList({params: {offset: newsOffset, publishState: 0}, loadMore: true}),
    );
  }, [newsLoading, allLoaded, newsOffset]);

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <FlatList
      style={styles.listContainer}
      refreshing={false}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => <NewsItem item={item} />}
      onRefresh={() => onRefresh()}
      onEndReached={() => loadMoreResults()}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: APP_THEME.spacing.padding,
  },
});

export default NewsList;
