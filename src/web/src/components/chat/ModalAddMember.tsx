import { Button, Checkbox, Input, List, Modal, Skeleton } from 'antd';
import Form, { FormComponentProps } from 'antd/lib/form';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { UserStatus } from '../../models/user/UserStatus.model';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';
import UserAvatar from './UserAvatar';

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface ModalAddMemberProps extends FormComponentProps {
    onVisible: (visible: boolean) => void;
    conversation: ConversationState
}

const FORM_ID = 'form-add-member';
const ModalAddMember: React.FC<ModalAddMemberProps> = ({ onVisible, form, conversation }) => {
    const dispatch = useDispatch();
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [usersLoading, setUsersLoading] = useState(true);
    const [useList, setUserList] = useState<UserStatus[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    
    const {
        getFieldDecorator,
        getFieldsError,
        getFieldError,
        isFieldTouched,
        validateFields,
        setFieldsValue,
    } = form;

    const roleError = (isFormSubmit || isFieldTouched("role")) && getFieldError("role");
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

    const handleOk = useCallback((event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsFormSubmit(true);
        validateFields(async (err, {  }) => {
            if (err) {
                setIsLoading(false);
                return;
            }

            const response = await comApi.addMembers({
                conversationId : conversation.id,
                memberIds : selectedUserIds
            })

            if(!response.isSuccess){
                setIsLoading(false);
                return;
            }

            dispatch(chatActions.addMembers({
                conversationId : conversation.id,
                members : response.data
            }));

            setIsLoading(false);
            onVisible(false);
        })

    }, [dispatch,conversation,selectedUserIds]);


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
                    form={FORM_ID}
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                    loading={isLoading}
                >
                    Đồng ý
                </Button>,
            ]}
        >
            <Form onSubmit={handleOk} id={FORM_ID}>
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

export default Form.create<ModalAddMemberProps>({ name: FORM_ID })(
    ModalAddMember
);