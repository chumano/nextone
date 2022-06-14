import { Button, Checkbox, Input, List, Modal, Skeleton, Form } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { userApi } from '../../apis/userApi';
import { ApiResult } from '../../models/apis/ApiResult.model';
import { User } from '../../models/user/User.model';
import { UserStatus } from '../../models/user/UserStatus.model';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';
import { handleAxiosApi } from '../../utils/functions';
import UserAvatar from './UserAvatar';



interface ModalAddMemberProps {
    onVisible: (visible: boolean) => void;
    conversation: ConversationState
}

const ModalAddMember: React.FC<ModalAddMemberProps> = ({ onVisible, conversation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [usersLoading, setUsersLoading] = useState(true);
    const [useList, setUserList] = useState<User[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [form] = Form.useForm();

    const fetchUsers = useCallback(async (textSearch :string) => {
        console.log('findUsers' , textSearch);
        const userResponse = await handleAxiosApi<ApiResult<User[]>>(userApi.list(textSearch, { offset: 0, pageSize: 5 },  true));
        //const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
        if(userResponse.isSuccess){
            setUserList(userResponse.data);
        }else{
            setUserList([])
        }
        
        setUsersLoading(false);
    },[userApi, setUserList]);

    useEffect(() => {
        setUsersLoading(true);
        fetchUsers('');
    }, [fetchUsers])

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


    const fetchGood = useMemo(() => {
        return debounce(fetchUsers, 500);
    }, [fetchUsers])

    const onTextSearchChange = useCallback((value: string)=>{
        fetchGood(value);
    },[]);
    
    return (
        <Modal
            title={'Thêm thành viên'}
            visible={true}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Huỷ bỏ
                </Button>,
                <Button key="ok"
                    type="primary"
                    onClick={handleOk}
                    disabled={
                        !form.isFieldsTouched(true) ||
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length ||
                        selectedUserIds.length ==0
                    }
                    loading={isLoading}
                >
                    Đồng ý
                </Button>,
            ]}
        >
            <Form onFinish={onFormFinish} form={form} layout='vertical'>
                <h6>Chọn thành viên</h6>
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(event)=> onTextSearchChange(event.target.value)}
                    onSearch={value => onTextSearchChange(value)}

                />
                <List
                    className="user-list"
                    loading={usersLoading}
                    itemLayout="horizontal"
                    dataSource={useList}
                    renderItem={(item, index) => (
                        <List.Item key={item.id} className="clickable"
                            onClick={()=>{
                                console.log("user click" , item)
                                setSelectedUserIds((userids) => {
                                    const checked = userids.find(id=> id == item.id);
                                    if (!checked) {
                                        return [...userids, item.id]
                                    }
                                    return userids.filter(id => id != item.id)
                                })
                            }}
                            actions={[
                                <Checkbox checked={selectedUserIds.indexOf(item.id) !== -1} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSelectedUserIds((userids) => {
                                        if (checked) {
                                            return [...userids, item.id]
                                        }
                                        return userids.filter(id => id != item.id)
                                    })
                                }} />
                            ]}
                        >
                            <Skeleton avatar title={false} loading={false} active>
                                <List.Item.Meta
                                    avatar={
                                        <UserAvatar  />
                                    }
                                    title={item.name}
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