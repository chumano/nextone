import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import NewsList from '../../components/News/NewsList';
import {AppDispatch} from '../../stores/app.store';
import {getList} from '../../stores/news';

const NewsScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getList({
        pageSize: 5,
        offset: 0,
        publishState: 0,
      }),
    );
  }, []);

  return (
    <SafeAreaView style={styles.newsScreenContainer}>
      <NewsList></NewsList>
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  newsScreenContainer: {
    flex: 1,
  },
});
