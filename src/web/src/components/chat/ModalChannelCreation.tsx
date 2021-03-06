import { Button, Checkbox, Input, List, Modal, Select, Form, Skeleton } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'

import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { CreateChannelDTO } from '../../models/dtos';
import { UserStatus } from '../../models/user/UserStatus.model';
import UserAvatar from './UserAvatar';
import { EventType } from '../../models/event/EventType.model';
import { createChannel } from '../../store/chat/chatThunks';

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
            title={title || 'T???o k??nh'}
            visible={true}
            onCancel={handleCancel}
            footer={[
				<Button key="cancel" onClick={handleCancel}>
					Hu??? b???
				</Button>,
				<Button key="ok"
                    onClick={handleOk}
					type="primary"
                    disabled={
                        //!form.isFieldsTouched(true) ||
                        !!form.getFieldsError().filter(({ errors }) => errors.length).length
                    }
					loading={isLoading}
				>
					?????ng ??
				</Button>,
			]}
        >
            <Form onFinish={onFormFinish} form={form}  layout='vertical'>
                <Form.Item name="name" label="T??n k??nh"
					required tooltip=""
                    rules={[{ required: true, message: '????y l?? tr?????ng b???t bu???c' }]}
				>
					<Input type="text" placeholder="T??n k??nh" />
				</Form.Item>

                <Form.Item  name="eventType" label="Lo???i s??? ki???n"
					required tooltip=""
                    rules={[{ required: true, message: '????y l?? tr?????ng b???t bu???c' }]}
				>
                    <Select  style={{ width: '100%' }} >
                        {eventTypes.map(o=> <Select.Option key={o.code} value={o.code}>{o.name}</Select.Option>)}
                    </Select>
				</Form.Item>
            </Form>

            {/* <hr/>
            <h6>Ch???n th??nh vi??n</h6>
            <Input.Search
                placeholder="T??m ki???m"
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