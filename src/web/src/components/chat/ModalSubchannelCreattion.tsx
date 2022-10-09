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

interface ModalSubchannelCreationProps{
    title?: string,
    parentId: string,
    parentName: string,
    onVisible: (visible: boolean) => void;
}
const ModalSubchannelCreation: React.FC<ModalSubchannelCreationProps>  = ({ title,parentId,parentName, onVisible}) => {
    const dispatch = useDispatch();
    const [usersLoading, setUsersLoading] = useState(true);
    const [useList, setUserList] = useState<UserStatus[]>([]);
    
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    
 
    useEffect(() => {

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
            eventTypeCodes: [],
            memberIds: selectedUserIds,
            parentId: parentId
        } 
        dispatch(createChannel(channel))
        setIsLoading(false);
        onVisible(false);
        
       
    },[form,parentId,selectedUserIds]);

    return (
        <Modal
            title={title || `Tạo kênh con thuộc kênh "${parentName}"`}
            visible={true}
            onCancel={handleCancel}
            footer={[
				<Button key="cancel" onClick={handleCancel}>
					Huỷ bỏ
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
					Đồng ý
				</Button>,
			]}
        >
            <Form onFinish={onFormFinish} form={form}  layout='vertical'>
                <Form.Item name="name" label="Tên kênh"
					required tooltip=""
                    rules={[{ required: true, message: 'Đây là trường bắt buộc' }]}
				>
					<Input type="text" placeholder="Tên kênh" />
				</Form.Item>
               
            </Form>
        </Modal>
    )
}



export default ModalSubchannelCreation;