import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { IAppStore } from '../../stores/app.store';
import { Conversation } from '../../types/Conversation/Conversation.type';
import { ConversationMember, MemberRole } from '../../types/Conversation/ConversationMember.type';
import { conversationApi } from '../../apis';
import { CreateConverationDTO } from '../../dto/CreateConverationDTO';
import { ConversationType } from '../../types/Conversation/ConversationType.type';
import { getConversationName } from '../../utils/conversation.utils';
import { conversationActions } from '../../stores/conversation';
import { ChatStackProps } from '../../navigation/ChatStack';

const MembersScreen = ({ navigation, route }: ChatStackProps) => {
    const dispatch = useDispatch();
    const { data: userInfo } = useSelector((store: IAppStore) => store.auth);
    const { data: listConversation, seletetedConversationId } = useSelector((store: IAppStore) => store.conversation);
    const [conversation, setConversation] = useState<Conversation>();

    useEffect(() => {
        if (!listConversation || !seletetedConversationId) return;
        const conversation = listConversation.find(o => o.id === seletetedConversationId);
        if (!conversation) return;
        setConversation(conversation);
    }, [listConversation, seletetedConversationId])

    const startConversation = async (selectedUserId:string) => {
        const conversationDTO: CreateConverationDTO = {
            name: '',
            type: ConversationType.Peer2Peer,
            memberIds: [selectedUserId]
        }

        const response = await conversationApi.getOrCreateConversation(conversationDTO);
        if (!response.isSuccess) {
            return;
        }
        const conversationRepsonse = await conversationApi.getConversation(response.data);
        if (!conversationRepsonse.isSuccess) {
            return;
        }
        const conversation = conversationRepsonse.data;
        //addOrUpdate Conversation list
        dispatch(conversationActions.addOrUpdateConversation(conversation));
        dispatch(conversationActions.selectConversation(conversation.id));

        const conversationName = getConversationName(conversation, userInfo!.userId);
        navigation.replace('ChatScreen', {
            conversationId: conversation.id,
            name: conversationName,
            conversationType: conversation.type
        });
    };
    
    if (!conversation) return <Loading />;

    const { members } = conversation;
    //console.log({ members })
    return (
        <SafeAreaView>
            <FlatList
                keyExtractor={(item: ConversationMember, _) => item.userMember.userId}
                data={members}
                renderItem={({ item: { userMember, role }, index }) => (
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.textName} >{userMember.userName}</Text>
                            <View>
                            <Text style={styles.textRole} >{MemberRole[role]}</Text>
                            </View>
                        </View>
                        <View style={styles.actionsContainer}>
                            {userInfo?.userId !== userMember.userId &&
                                <Button onPress={()=>{startConversation(userMember.userId)}}>
                                    <MaterialCommunityIcon name='chat-processing-outline' size={32} color={'#000'} />
                                </Button>
                            }
                            
                        </View>
                    </View>
                )}

            />
        </SafeAreaView>
    )
}

export default MembersScreen

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    actionsContainer: {
        marginLeft: 'auto',
    },
    textName: {
        fontSize: 16,
        color: '#000'
    },
    textRole: {
        fontSize: 12,
        color: '#000',
        opacity:0.5
    },
});