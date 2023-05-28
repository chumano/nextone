import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {debounce} from 'lodash';
import {Text, TextInput} from 'react-native-paper';
import {userApi} from '../../apis/user.api';
import {CreateConverationDTO} from '../../dto/CreateConverationDTO';
import {ConversationType} from '../../types/Conversation/ConversationType.type';
import {User} from '../../types/User/User.type';
import {ChatStackProps} from '../../navigation/ChatStack';
import {conversationApi} from '../../apis';
import {useDispatch, useSelector} from 'react-redux';
import {conversationActions} from '../../stores/conversation';
import {IAppStore} from '../../stores/app.store';
import {getConversationName} from '../../utils/conversation.utils';
import {APP_THEME} from '../../constants/app.theme';
import Loading from '../../components/Loading';
import UserAvatar from '../../components/User/UserAvatar';

const FindUsersScreen = ({navigation, route}: ChatStackProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);

  const fetchUsers = useCallback(
    async (textSearch: string) => {
      setLoading(true);
      const userResponse = await userApi.list(
        textSearch,
        {offset: 0, pageSize: 10},
        true,
      );
      if (userResponse.isSuccess) {
        setUserList(userResponse.data);
      } else {
        setUserList([]);
      }

      setLoading(false);
    },
    [userApi, setUserList],
  );

  useEffect(() => {
    fetchUsers('');
  }, [fetchUsers]);

  const handleOk = async (selectedUserId: string) => {
    const conversationDTO: CreateConverationDTO = {
      name: '',
      type: ConversationType.Peer2Peer,
      memberIds: [selectedUserId!],
    };

    const response = await conversationApi.getOrCreateConversation(
      conversationDTO,
    );
    if (!response.isSuccess) {
      return;
    }
    const conversationRepsonse = await conversationApi.getConversation(
      response.data,
    );
    if (!conversationRepsonse.isSuccess) {
      return;
    }
    const conversation = conversationRepsonse.data;

    //addOrUpdate Conversation list
    dispatch(conversationActions.addOrUpdateConversation(conversation));
    dispatch(conversationActions.selectConversation(conversation.id));

    const conversationName = getConversationName(
      conversation,
      userInfo!.userId,
    );
    navigation.replace('ChatScreen', {
      conversationId: conversation.id,
      name: conversationName,
      conversationType: conversation.type,
    });
  };

  const fetchGood = useMemo(() => {
    return debounce(fetchUsers, 500);
  }, [fetchUsers]);

  const onTextSearchChange = useCallback((value: string) => {
    fetchGood(value);
  }, []);

  return (
    <View style={styles.findUserScreenContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TextInput
          placeholder={'Nhập tên người dùng'}
          placeholderTextColor={APP_THEME.colors.accent}
          selectionColor={APP_THEME.colors.accent}
          mode={'flat'}
          activeUnderlineColor={APP_THEME.colors.accent}
          style={styles.input}
          onChangeText={onTextSearchChange}
        />
      </View>

      {loading && <Loading />}

      <FlatList
        keyExtractor={(item: User, _) => item.id}
        data={userList}
        ListEmptyComponent={() => {
          return (
            <>
              {!loading ? (
                <View style={styles.notFoundContainer}>
                  <Text style={styles.notFoundText}>
                    Không tìm thấy người dùng!
                  </Text>
                </View>
              ) : null}
            </>
          );
        }}
        renderItem={props => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              handleOk(props.item.id).then();
            }}>
            <UserAvatar size={32} />
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{props.item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  findUserScreenContainer: {
    flex: 1,
    padding: APP_THEME.spacing.padding,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: APP_THEME.spacing.between_component,

    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: APP_THEME.colors.backdrop,
    backgroundColor: APP_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: APP_THEME.rounded,
  },
  notFoundContainer: {
    padding: APP_THEME.spacing.padding,
  },
  notFoundText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    opacity: 0.7,
  },
  input: {
    flex: 1,
    height: 44,
    marginVertical: APP_THEME.spacing.between_component,
    backgroundColor: APP_THEME.colors.background,
    marginRight: APP_THEME.spacing.between_component,
  },
  userNameContainer: {
    marginLeft: APP_THEME.spacing.between_component,
  },
  userName: {
    fontSize: 16,
    lineHeight: 20,
  },
});

export default FindUsersScreen;
