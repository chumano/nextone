import { Avatar, Badge, Checkbox, Icon, Input, List, Modal, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { CreateConverationDTO } from '../../models/dtos';
import { UserStatus } from '../../models/user/UserStatus.model';
import { chatActions, getOrCreateConversation } from '../../store/chat/chatReducer';
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
        const [useList, setUserList] = useState<UserStatus[]>([]);
        const [selectedUserId, setSelectedUserId] = useState<string>();

        useEffect(() => {
            const fetchUsers = async () => {
                const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
                setUserList(usersReponse.data);
                setLoading(false);
            }
            setLoading(true);
            fetchUsers();
        }, [])

        const handleOk = () => {
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

        return (
            <Modal
                title={title || 'Tìm người dùng'}
                visible={true}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input.Search
                    placeholder="Tìm kiếm"
                    onSearch={value => console.log(value)}

                />

                <List
                    className="user-list"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={useList}
                    renderItem={ (item,index) => (
                        <List.Item
                            actions={[
                                <Checkbox  checked={selectedUserId===item.userId} onChange={(e) => {
                                    const checked = e.target.value;
                                    setSelectedUserId(item.userId)
                                }} />
                            ]}
                        >
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    avatar={
                                        <UserAvatar user={item}/>
                                    }
                                    title={item.userName}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Modal>
        )
    }

export default ModalFindUser