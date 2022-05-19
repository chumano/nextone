import { Button, Checkbox, Input, List, Modal, Select, Skeleton } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'

import Form, { FormComponentProps } from "antd/lib/form";
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

interface ModalChannelCreationProps extends FormComponentProps {
    title?: string,
    onVisible: (visible: boolean) => void;
}
const ModalChannelCreation: React.FC<ModalChannelCreationProps>  = ({ title, onVisible, form}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [useList, setUserList] = useState<UserStatus[]>([]);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [name, setName] = useState<string>('');
    const {
		getFieldDecorator,
		getFieldsError,
		getFieldError,
		isFieldTouched,
		validateFields,
	} = form;
    const nameError = (isFormSubmit || isFieldTouched("name")) && getFieldError("name");
    const eventTypeError = (isFormSubmit || isFieldTouched("eventType")) && getFieldError("eventType");

    useEffect(() => {
        const fetchUsers = async () => {
            const usersReponse = await comApi.getUsers({ excludeMe: true, offset: 0, pageSize: 10 });
            setUserList(usersReponse.data);
            setLoading(false);
        }

        const fetcheEventTypes = async () =>{
            const dataReponse = await comApi.getEventTypes();
            setEventTypes(dataReponse.data);
            setLoading(false);
        }

        setLoading(true);
        fetchUsers();
        fetcheEventTypes();
    }, [])

    const handleOk = useCallback((event) => {
		event.preventDefault();
		setIsLoading(true);
        setIsFormSubmit(true);
        validateFields(async (err, { name }) => {
            if(err){
                setIsLoading(false);
                return;
            }
            const channel : CreateChannelDTO={
                name: name,
                memberIds: selectedUserIds
            } 
            dispatch(createChannel(channel))
            setIsLoading(false);
            onVisible(false);
        })
       
    },[name, selectedUserIds]);

    const handleCancel = () => {
        onVisible(false);
    };

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
					form="form-channel-creation"
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
            <Form onSubmit={handleOk} id="form-channel-creation">
                <Form.Item label="Tên kênh"
					validateStatus={nameError ? "error" : ""}
					help={nameError || ""}
				>
					{getFieldDecorator("name", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
						],
					})(
						<Input type="text" placeholder="Tên kênh" />
					)}
				</Form.Item>

                <Form.Item label="Loại sự kiện"
					validateStatus={eventTypeError ? "error" : ""}
					help={eventTypeError || ""}
				>
					{getFieldDecorator("eventType", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
						],
					})(
                        <Select  >
                            {eventTypes.map(o=> <Select.Option value={o.code}>{o.name}</Select.Option>)}
                        </Select>
					)}
				</Form.Item>
            </Form>

            <hr/>
            <h6>Chọn thành viên trong kênh</h6>
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
                            <Checkbox  checked={selectedUserIds.indexOf(item.userId)!==-1} onChange={(e) => {
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
            />
        </Modal>
    )
}



export default Form.create<ModalChannelCreationProps>({ name: "form-channel-creation" })(
	ModalChannelCreation
);