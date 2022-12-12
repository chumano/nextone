import { Button, Checkbox, Input, List, Modal, Skeleton, Form, Divider } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from '../../utils';



interface ModalAddMemberProps {
    onVisible: (visible: boolean) => void;
    conversation: ConversationState
}

const ModalAddMember: React.FC<ModalAddMemberProps> = ({ onVisible, conversation }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [usersLoading, setUsersLoading] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [textSearch, setTextSearch] = useState<string>('')

    const [form] = Form.useForm();

    const fetchUsers = async (textSearch: string, offset: number) => {
        const  excludeMe = true;
        const orderBy = 'Date';
        const countResponse = await handleAxiosApi<ApiResult<number>>(userApi.count(textSearch, excludeMe));
        const userResponse = await handleAxiosApi<ApiResult<User[]>>(userApi.list(textSearch, { offset: offset, pageSize: 20 },
            excludeMe, orderBy));
        if(countResponse.isSuccess && userResponse.isSuccess){
            return {
                data: userResponse.data,
                count: countResponse.data 
            }
        }
        return {
            data:[],
            count:0
        }
    }

    const loadMoreData =async (reload?: boolean)=>{
        if(usersLoading){
            return;
        }
        setUsersLoading(true);
        const data = await fetchUsers(textSearch, reload?0: userList.length)
        
       
        if(reload){
            setUserList(data.data);
        }else{
            setUserList([...userList, ...data.data]);
        }
       
        setUserCount(data.count);
        setUsersLoading(false);
    };

    useEffect(() => {
        loadMoreData(true);
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
    
    const onSearch = async (value: string)=>{
        setUsersLoading(true);
        loadMoreData(true)
    }

    const debounceFetch= useDebounce((value)=>{
        loadMoreData(true)
    },500)

    const onTextSearchChange = async (value: string) => {
       
        setTextSearch(value)
        debounceFetch(value);
    }

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
                        selectedUserIds.length == 0
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
                    value={textSearch}
                    onChange={(event) => onTextSearchChange(event.target.value)}
                    onSearch={value => onSearch(value)}

                />
                <div
                    id="scrollableDiv"
                    style={{
                        height: 400,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    <InfiniteScroll
                        dataLength={userList.length}
                        next={loadMoreData}
                        hasMore={userList.length < userCount}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain></Divider>}
                        scrollableTarget="scrollableDiv"   >
                        <List
                            className="user-list"
                            loading={usersLoading}
                            itemLayout="horizontal"
                            dataSource={userList}
                            renderItem={(item, index) => (
                                <List.Item key={item.id} className="clickable"
                                    onClick={() => {
                                        //console.log("user click" , item)
                                        setSelectedUserIds((userids) => {
                                            const checked = userids.find(id => id == item.id);
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
                                                <UserAvatar />
                                            }
                                            title={item.name}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    </InfiniteScroll>
                </div>
            </Form>

        </Modal>
    )
}

export default ModalAddMember;