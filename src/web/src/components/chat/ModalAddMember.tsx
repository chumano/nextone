import { Button, Checkbox, Input, List, Modal, Skeleton } from 'antd';
import Form from 'antd/lib/form';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { UserStatus } from '../../models/user/UserStatus.model';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';
import UserAvatar from './UserAvatar';

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface ModalAddMemberProps {
    onVisible: (visible: boolean) => void;
    conversation: ConversationState
}

const ModalAddMember: React.FC<ModalAddMemberProps> = ({ onVisible, conversation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [usersLoading, setUsersLoading] = useState(true);
    const [useList, setUserList] = useState<UserStatus[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUsers = async () => {
            const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
            setUserList(usersReponse.data);
            setUsersLoading(false);
        }


        setUsersLoading(true);
        fetchUsers();
    }, [])

    const handleCancel = () => {
        onVisible(false);
    };
    const handleOk = useCallback(async (event) => {
        await form.validateFields();
        form.submit();
    }, [form]);

    const onFormFinish = useCallback(async (values: any) => {
        setIsLoading(true);

        const response = await comApi.addMembers({
            conversationId: conversation.id,
            memberIds: selectedUserIds
        })

        if (!response.isSuccess) {
            setIsLoading(false);
            return;
        }

        dispatch(chatActions.addMembers({
            conversationId: conversation.id,
            members: response.data
        }));

        setIsLoading(false);
        onVisible(false);

    }, [dispatch, conversation, selectedUserIds]);


    return (
        <Modal
            title={'Thêm thành viên'}
            visible={true}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Huỷ bỏ
                </Button>,
                <Button
                    type="primary"
                    onClick={handleOk}
                    disabled={
                        !form.isFieldsTouched(true) ||
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
                    loading={isLoading}
                >
                    Đồng ý
                </Button>,
            ]}
        >
            <Form onFinish={onFormFinish}>
                <h6>Chọn thành viên</h6>
                <Input.Search
                    placeholder="Tìm kiếm"
                    onSearch={value => console.log(value)}

                />
                <List
                    className="user-list"
                    loading={usersLoading}
                    itemLayout="horizontal"
                    dataSource={useList}
                    renderItem={(item, index) => (
                        <List.Item key={item.userId}
                            actions={[
                                <Checkbox checked={selectedUserIds.indexOf(item.userId) !== -1} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSelectedUserIds((userids) => {
                                        if (checked) {
                                            return [...userids, item.userId]
                                        }
                                        return userids.filter(id => id != item.userId)
                                    })
                                }} />
                            ]}
                        >
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    avatar={
                                        <UserAvatar user={item} />
                                    }
                                    title={item.userName}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />

            </Form>

        </Modal>
    )
}

export default ModalAddMember;