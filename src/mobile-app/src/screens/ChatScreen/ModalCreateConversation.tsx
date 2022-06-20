import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native'
import { debounce } from 'lodash';
import { Button, Checkbox, Dialog, Text, TextInput } from 'react-native-paper'
import { userApi } from '../../apis/user.api'
import { CreateConverationDTO } from '../../dto/CreateConverationDTO'
import { ConversationType } from '../../types/Conversation/ConversationType.type'
import { User } from '../../types/User/User.type'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatStackProps } from '../../navigation/ChatStack';
import { conversationApi } from '../../apis';
import { useDispatch, useSelector } from 'react-redux';
import { conversationActions } from '../../stores/conversation';
import { IAppStore } from '../../stores/app.store';
import { getConversationName } from '../../utils/conversation.utils';

const FindUsersScreen = ({ navigation, route }: ChatStackProps) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const { data: userInfo } = useSelector((store: IAppStore) => store.auth);
    navigation.setOptions({
        headerRight: () => {
            return <Button disabled={!selectedUserId} onPress={handleOk}>
                <Text>OK</Text>
            </Button>
        }
    });

    const fetchUsers = useCallback(async (textSearch: string) => {
        setLoading(true);
        const userResponse = await userApi.list(textSearch, { offset: 0, pageSize: 10 }, true);
        if (userResponse.isSuccess) {
            setUserList(userResponse.data);
        } else {
            setUserList([])
        }

        setLoading(false);
    }, [userApi, setUserList]);

    useEffect(() => {
        fetchUsers('');
    }, [fetchUsers])

    const handleOk = async () => {
        const conversationDTO: CreateConverationDTO = {
            name: '',
            type: ConversationType.Peer2Peer,
            memberIds: [selectedUserId!]
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
        
        const conversationName = getConversationName(conversation, userInfo!.userId);
        dispatch(conversationActions.selectConversation(conversation.id));
        navigation.replace('ChatScreen', {
            conversationId: conversation.id,
            name: conversationName,
            conversationType: conversation.type
        });
    };

    const fetchGood = useMemo(() => {
        return debounce(fetchUsers, 500);
    }, [fetchUsers])

    const onTextSearchChange = useCallback((value: string) => {
        fetchGood(value);
    }, []);


    return <SafeAreaView>
        <TextInput
            placeholder="Tìm người dùng"
            onChangeText={onTextSearchChange}
        />
        {loading &&
            <ActivityIndicator />
        }


        <FlatList
            keyExtractor={(item: User, _) => item.id}
            data={userList}
            ListEmptyComponent={() => {
                return <> 
                {!loading ? <View style={{alignItems:'center', marginTop: 20}}>
                    <Text style={{fontSize:12}}>Không tìm thấy</Text>
                </View> : null
                }
                </>
            }}
            renderItem={props => <>
                <TouchableOpacity onPress={() => {
                    setSelectedUserId(props.item.id);
                }}>
                    <Checkbox.Item label={props.item.name} status={selectedUserId === props.item.id ? 'checked' : 'unchecked'} />
                </TouchableOpacity>
            </>}
        />

    </SafeAreaView>
}

export default FindUsersScreen