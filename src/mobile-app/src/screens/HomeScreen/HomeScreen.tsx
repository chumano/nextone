import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Chat: undefined;
  Feed: { sort: 'latest' | 'top' } | undefined;
};

//https://reactnavigation.org/docs/typescript/
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen :React.FC<Props> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate('Chat')}
      />
    </View>
  );
}

export default HomeScreen