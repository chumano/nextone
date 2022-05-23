import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps, NativeStackNavigationProp  } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;//{ userId: string };
};

//https://reactnavigation.org/docs/typescript/
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;

export const HomeScreen = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  
}
