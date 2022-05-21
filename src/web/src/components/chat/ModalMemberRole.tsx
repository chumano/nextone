import { Button, Input, Modal, Select } from 'antd'
import Form, { FormComponentProps } from 'antd/lib/form';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationMember, MemberRole } from '../../models/conversation/ConversationMember.model';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface ModalMemberRoleProps extends FormComponentProps {
    onVisible: (visible: boolean) => void;
    conversation: ConversationState;
    member : ConversationMember;
}
const FORM_ID = 'form-member-role';
const ModalMemberRole: React.FC<ModalMemberRoleProps> = ({conversation, member, onVisible, form }) => {
    const dispatch = useDispatch();
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        getFieldDecorator,
        getFieldsError,
        getFieldError,
        isFieldTouched,
        validateFields,
        setFieldsValue,
    } = form;

    const roles : MemberRole[] = [MemberRole.MANAGER, MemberRole.MEMBER]
    const roleError = (isFormSubmit || isFieldTouched("role")) && getFieldError("role");

    useEffect(()=>{
        setFieldsValue({
            "role": member.role
        })
    },[member,setFieldsValue])
    
    const handleCancel = () => {
        onVisible(false);
    };

    const handleOk = useCallback((event) => {
		event.preventDefault();
		setIsLoading(true);
        setIsFormSubmit(true);
        validateFields(async (err, { role }) => {
            if(err){
                setIsLoading(false);
                return;
            }
          
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
        })
       
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
                <Input disabled value={member.userMember.userName}></Input>
                
                <Form.Item label="Quyền"
					validateStatus={roleError ? "error" : ""}
					help={roleError || ""}
				>
					{getFieldDecorator("role", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
						],
					})(
                        <Select >
                            {roles.map(o=> <Select.Option key={o} value={o}>{MemberRole[o]}</Select.Option>)}
                        </Select>
					)}
				</Form.Item>

            </Form>

        </Modal>
    )
}

export default Form.create<ModalMemberRoleProps>({ name: FORM_ID })(
	ModalMemberRole
);