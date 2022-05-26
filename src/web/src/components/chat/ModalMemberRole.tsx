import { Button, Input, Modal, Select } from 'antd'
import Form from 'antd/lib/form';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationMember, MemberRole } from '../../models/conversation/ConversationMember.model';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface ModalMemberRoleProps{
    onVisible: (visible: boolean) => void;
    conversation: ConversationState;
    member : ConversationMember;
}
const ModalMemberRole: React.FC<ModalMemberRoleProps> = ({conversation, member, onVisible}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const roles : MemberRole[] = [MemberRole.MANAGER, MemberRole.MEMBER]
  
    useEffect(()=>{
        form.setFieldsValue({
            "role": member.role
        })
    },[form,member])
    
    const handleCancel = () => {
        onVisible(false);
    };

    const handleOk = async () => {
        await form.validateFields();
        form.submit();
    };

    const onFormFinish = useCallback(async (values:any) => {
		setIsLoading(true);
    
        const role = values['role'];
        //TODO: send dispatch
        const response = await comApi.updateMemberRole({
            conversationId: conversation.id,
            userMemberId: member.userMember.userId,
            role : role
        })

        if(!response.isSuccess){
            setIsLoading(false);
            return;
        }

        dispatch(chatActions.updateMemberRole({
            conversationId : conversation.id,
            member : {
                userMember: member.userMember,
                role: role
            }
        }));
        
        setIsLoading(false);
        onVisible(false);
       
    },[conversation, dispatch]);
    return (
        <Modal
            title={'Cấp quyền cho thành viên'}
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
            <Form onFinish={onFormFinish} >
                <Input disabled value={member.userMember.userName}></Input>
                
                <Form.Item label="Quyền"
                    rules={[{ required: true, message: 'Đây là trường bắt buộc' }]}
				>
                    <Select >
                        {roles.map(o=> <Select.Option key={o} value={o}>{MemberRole[o]}</Select.Option>)}
                    </Select>
					
				</Form.Item>

            </Form>

        </Modal>
    )
}

export default ModalMemberRole;