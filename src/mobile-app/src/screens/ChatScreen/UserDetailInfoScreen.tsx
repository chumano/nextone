import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {userApi} from '../../apis/user.api';
import Loading from '../../components/Loading';
import {APP_THEME} from '../../constants/app.theme';
import {UserDetailInfoRouteProp} from '../../navigation/ChatStack';
import {IAppStore} from '../../stores/app.store';
import {User} from '../../types/User/User.type';

const UserDetailInfoScreen = () => {
  const {data: conversationList} = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const {data: userAuth} = useSelector((store: IAppStore) => store.auth);
  const router = useRoute<UserDetailInfoRouteProp>();
  const [user, setUser] = useState<User>();

  const fallbackText = (
    <View style={styles.errorTextContainer}>
      <Text>Có lỗi xảy ra</Text>
    </View>
  );

  useEffect(() => {
    const foundConversation = conversationList?.find(
      c => c.id === router.params.conversationId,
    );
    if (!foundConversation) return;
    const notUserAuthMember = foundConversation.members.find(
      m => m.userMember.userId !== userAuth?.userId,
    );
    if (!notUserAuthMember) return;

    const fetchUser = async (userId: string) => {
      try {
        const response = await userApi.getUser(userId);
        if (response.isSuccess) {
          setUser(response.data);
        } else {
          return fallbackText;
        }
      } catch (error) {
        return fallbackText;
      }
    };

    fetchUser(notUserAuthMember.userMember.userId);
  }, [conversationList, userAuth, setUser]);

  if (!user)
    return (
      <View style={styles.errorTextContainer}>
        <Loading />
      </View>
    );

  return (
    <View style={styles.userDetailInfoContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Tên</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text>{user.name}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Email</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text>{user.email}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Số điện thoại</Text>
        </View>
        <TouchableOpacity
          style={styles.valueContainer}
          onPress={() => Linking.openURL(`tel:${user.phone}`)}>
          <Text style={styles.phoneNumber}>{user.phone}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserDetailInfoScreen;

const styles = StyleSheet.create({
  errorTextContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  userDetailInfoContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginTop: 16,
    borderBottomWidth: 0.5,
    borderColor: APP_THEME.colors.placeholder,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
  },
  valueContainer: {
    flex: 1,
  },
  labelText: {
    fontWeight: '200',
  },
  phoneNumber: {
    color: APP_THEME.colors.primary,
  },
});
