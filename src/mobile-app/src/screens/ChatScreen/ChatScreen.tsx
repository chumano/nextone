import React, {useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import UserAvatar from '../../components/User/UserAvatar';
import {ChatStackProps} from '../../navigation/ChatStack';

const ChatScreen = ({navigation}: ChatStackProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'julian wan',
      headerTitle: ({children, tintColor}) => (
        <View style={styles.headerContainer}>
          <UserAvatar
            imageUri="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            size={24}
          />
          <View style={styles.userNameContainer}>
            <Text style={styles.userNameText}>{children}</Text>
          </View>
        </View>
      ),
    });
  }, [navigation]);
  return <Text>ChatScreen</Text>;
};

export default ChatScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameContainer: {
    marginLeft: 8,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});
