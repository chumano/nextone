import { Avatar, Badge, Checkbox, Input, List, Modal, Skeleton } from 'antd'
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { userApi } from '../../apis/userApi';
import { ApiResult } from '../../models/apis/ApiResult.model';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { CreateConverationDTO } from '../../models/dtos';
import { User } from '../../models/user/User.model';
import { UserStatus } from '../../models/user/UserStatus.model';
import { chatActions } from '../../store/chat/chatReducer';
import { getOrCreateConversation } from '../../store/chat/chatThunks';
import { handleAxiosApi } from '../../utils/functions';
import UserAvatar from './UserAvatar';
interface ModalFindUserProps {
    title?: string,
    multi?: boolean
    onVisible: (visible: boolean) => void;
}
const ModalFindUser: React.FC<ModalFindUserProps> =
    ({ title, onVisible, multi }) => {
        const dispatch = useDispatch();
        const [loading, setLoading] = useState(true);
        const [useList, setUserList] = useState<User[]>([]);
        const [selectedUserId, setSelectedUserId] = useState<string>();

        const fetchUsers = useCallback(async (textSearch :string) => {
            console.log('findUsers' , textSearch);
            const userResponse = await handleAxiosApi<ApiResult<User[]>>(userApi.list(textSearch, { offset: 0, pageSize: 5 },  true));
            //const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
            if(userResponse.isSuccess){
                setUserList(userResponse.data);
            }else{
                setUserList([])
            }
            
            setLoading(false);
        },[userApi, setUserList]);

        useEffect(() => {
            setLoading(true);
            fetchUsers('');
        }, [fetchUsers])

        const handleOk = () => {
            //START_P2P_CHAT
            const conversation : CreateConverationDTO={
                name: '',
                type: ConversationType.Peer2Peer,
                memberIds: [selectedUserId!]
            } 
            dispatch(getOrCreateConversation(conversation))
            onVisible(false);
        };

        const handleCancel = () => {
            onVisible(false);
        };

        const fetchGood = useMemo(() => {
            return debounce(fetchUsers, 500);
        }, [fetchUsers])

        const onTextSearchChange = useCallback((value: string)=>{
            fetchGood(value);
        },[]);

        return (
            <Modal
                title={title || 'Tìm người dùng'}
                visible={true}
                okButtonProps={{
                    disabled: !selectedUserId
                }}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(event)=> onTextSearchChange(event.target.value)}
                    onSearch={value => onTextSearchChange(value)}
                />

                <List
                    className="user-list"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={useList}
                    renderItem={ (item,index) => (
                        <List.Item  className='clickable'
                            onClick={()=>{
                                console.log("user click" , item)
                                setSelectedUserId(item.id)
                            }}
                            actions={[
                                <Checkbox  checked={selectedUserId===item.id} onChange={(e) => {
                                    const checked = e.target.value;
                                    setSelectedUserId(item.id)
                                }} />
                            ]}
                        >
                            <Skeleton avatar title={false} loading={false} active >
                                <List.Item.Meta 
                                    avatar={
                                        <UserAvatar />
                                    }
                                    title={item.name}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Modal>
        )
    }

export default ModalFindUser