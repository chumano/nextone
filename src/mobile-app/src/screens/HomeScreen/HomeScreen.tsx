import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {DetailsScreenNavigationProp} from '../../navigation/HomeStack';

export const HomeScreen = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const onDetailScreenHandler = () => {
    navigation.navigate('DetailsScreen');
  };
  return (
    <View style={styles.homeScreenContainer}>
      <Text>Home Screen</Text>
      <Button title="Go to Chat" onPress={onDetailScreenHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
