import { Button, Checkbox, Input, List, Modal, Select, Skeleton } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'

import Form from "antd/lib/form";
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { CreateChannelDTO } from '../../models/dtos';
import { UserStatus } from '../../models/user/UserStatus.model';
import UserAvatar from './UserAvatar';
import { createChannel } from '../../store/chat/chatReducer';
import { EventType } from '../../models/event/EventType.model';

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
	return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface ModalChannelCreationProps{
    title?: string,
    onVisible: (visible: boolean) => void;
}
const ModalChannelCreation: React.FC<ModalChannelCreationProps>  = ({ title, onVisible}) => {
    const dispatch = useDispatch();
    const [usersLoading, setUsersLoading] = useState(true);
    const [useList, setUserList] = useState<UserStatus[]>([]);
    
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    
 
    useEffect(() => {
        const fetchUsers = async () => {
            const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
            setUserList(usersReponse.data);
            setUsersLoading(false);
        }

        const fetcheEventTypes = async () =>{
            const dataReponse = await comApi.getEventTypes();
            setEventTypes(dataReponse.data);
            setUsersLoading(false);
        }

        setUsersLoading(true);
        fetchUsers();
        fetcheEventTypes();
    }, [])

    
    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const handleCancel = () => {
        onVisible(false);
    };

    const onFormFinish = useCallback(async (values:any) => {

		setIsLoading(true);
     
        const channel : CreateChannelDTO={
            name: values['name'],
            eventTypeCodes: [values['eventType']],
            memberIds: selectedUserIds
        } 
        dispatch(createChannel(channel))
        setIsLoading(false);
        onVisible(false);
        
       
    },[form,selectedUserIds]);

    return (
        <Modal
            title={title || 'Tạo kênh'}
            visible={true}
            onCancel={handleCancel}
            footer={[
				<Button key="back" onClick={handleCancel}>
					Huỷ bỏ
				</Button>,
				<Button
                    onClick={handleOk}
					type="primary"
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
                <Form.Item label="Tên kênh"
					required tooltip=""
                    rules={[{ required: true, message: 'Đây là trường bắt buộc' }]}
				>
					<Input type="text" placeholder="Tên kênh" />
				</Form.Item>

                <Form.Item label="Loại sự kiện"
					required tooltip=""
                    rules={[{ required: true, message: 'Đây là trường bắt buộc' }]}
				>
                    <Select  >
                        {eventTypes.map(o=> <Select.Option key={o.code} value={o.code}>{o.name}</Select.Option>)}
                    </Select>
				</Form.Item>
            </Form>

            {/* <hr/>
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
                renderItem={ (item,index) => (
                    <List.Item key={item.userId}
                        actions={[
                            <Checkbox checked={selectedUserIds.indexOf(item.userId)!==-1} onChange={(e) => {
                                const checked = e.target.checked;
                                setSelectedUserIds((userids)=>{
                                    if(checked){
                                        return [...userids,item.userId ]
                                    }
                                    return userids.filter(id => id !=item.userId  )
                                })
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
            /> */}
        </Modal>
    )
}



export default ModalChannelCreation;