import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import {IAppStore} from '../../stores/app.store';
import {Conversation} from '../../types/Conversation/Conversation.type';
import {
  ConversationMember,
  MemberRole,
} from '../../types/Conversation/ConversationMember.type';
import {conversationApi} from '../../apis';
import {CreateConverationDTO} from '../../dto/CreateConverationDTO';
import {ConversationType} from '../../types/Conversation/ConversationType.type';
import {getConversationName} from '../../utils/conversation.utils';
import {conversationActions} from '../../stores/conversation';
import {ChatStackProps} from '../../navigation/ChatStack';
import UserAvatar from '../../components/User/UserAvatar';
import {APP_THEME} from '../../constants/app.theme';

const MembersScreen = ({navigation, route}: ChatStackProps) => {
  const dispatch = useDispatch();
  const {data: userInfo} = useSelector((store: IAppStore) => store.auth);
  const {data: listConversation, seletetedConversationId} = useSelector(
    (store: IAppStore) => store.conversation,
  );
  const [conversation, setConversation] = useState<Conversation>();

  useEffect(() => {
    if (!listConversation || !seletetedConversationId) {
      return;
    }
    const conversation = listConversation.find(
      o => o.id === seletetedConversationId,
    );
    if (!conversation) {
      return;
    }
    setConversation(conversation);
  }, [listConversation, seletetedConversationId]);

  const startConversation = async (selectedUserId: string) => {
    const conversationDTO: CreateConverationDTO = {
      name: '',
      type: ConversationType.Peer2Peer,
      memberIds: [selectedUserId],
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

  if (!conversation) {
    return <Loading />;
  }

  const {members} = conversation;
  //console.log({ members })
  return (
    <View style={styles.memberScreenContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: ConversationMember, _) => item.userMember.userId}
        data={members}
        renderItem={({item: {userMember, role}, index}) => (
          <View style={styles.container}>
            <UserAvatar size={48} user={userMember} />
            <View style={styles.memberInformation}>
              <View style={styles.memberContainer}>
                <Text numberOfLines={1} style={styles.textName}>
                  {userMember.userName}
                </Text>
                <Text style={styles.textRole}>{MemberRole[role]}</Text>
              </View>
              <View style={styles.actionsContainer}>
                {userInfo?.userId !== userMember.userId && (
                  <Button
                    onPress={() => {
                      startConversation(userMember.userId);
                    }}>
                    <MaterialCommunityIcon
                      name="chat-processing-outline"
                      size={24}
                      color={APP_THEME.colors.accent}
                    />
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MembersScreen;

const styles = StyleSheet.create({
  memberScreenContainer: {
    flex: 1,
    padding: 8,
  },
  container: {
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
  memberInformation: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: APP_THEME.spacing.between_component,
  },
  memberContainer: {
    maxWidth: '70%',
  },
  actionsContainer: {
    marginLeft: 'auto',
  },
  textName: {
    fontSize: 16,
    lineHeight: 20,
  },
  textRole: {
    fontSize: 10,
    lineHeight: 14,
    opacity: 0.7,
  },
});
