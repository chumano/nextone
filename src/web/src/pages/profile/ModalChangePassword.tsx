import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, message, Modal } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { userApi } from '../../apis/userApi';
import { User } from '../../models/user/User.model';
interface ModalChangePasswordProps{
    userProfile: User,
    onClose : ()=>void
}

const ModalChangePassword: React.FC<ModalChangePasswordProps> = ({userProfile, onClose}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			oldPasword: '',
			newPassword: '',
			newPassword2: '',
		});
	}, []);

	const hideModalHandler = () => {
		onClose();
	};

	const handleOk = async () => {
		await form.validateFields();
		form.submit();
	};
	const onFormFinish = async (values:any) => {
		setIsLoading(true);
	
		const userUpdated = {
			oldPassword: values['oldPassword'],
			newPassword: values['newPassword'],
		};
		try {
			const { isSuccess, errorMessage } = await userApi.changeMyPassword(userUpdated);
			
			if (!isSuccess) {
                message.error(errorMessage);
                return;
			}

            message.success("Cập nhật thông tin thành công");
			hideModalHandler();
		} catch (error) {
            console.error('changeMyPassword', error)
			message.error("Mật khẩu không đúng");
		} finally{
            setIsLoading(false);
        }
	};

	return (
		<Modal
			title="Đổi mật khẩu"
			visible={true}
			onCancel={hideModalHandler}
			footer={[
				<Button key="cancel" onClick={hideModalHandler}>
					Huỷ bỏ
				</Button>,
				<Button key="ok" onClick={handleOk}
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
			<Form onFinish={onFormFinish} form={form} layout='vertical'>
				<Form.Item name='oldPassword' label='Mật khẩu cũ'
					rules={[
						{ required: true, message: 'Đây là trường bắt buộc' }
					]}
				>
					<Input.Password
						placeholder="Mật khẩu cũ"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
					/>
				</Form.Item>
				<Form.Item name='newPassword' label='Mật khẩu mới'
					rules={[
						{ required: true, message: 'Đây là trường bắt buộc' },
                        {min: 6, message: 'Phải ít nhất 6 ký tự'}
					]}
				>
					<Input.Password
						type="password"
						placeholder="Mật khẩu mới"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
					/>
				</Form.Item>
                <Form.Item name='newPassword2' label='Nhập lại mật khẩu mới'
					rules={[
						{ required: true, message: 'Đây là trường bắt buộc' },
                        {min: 6, message: 'Phải ít nhất 6 ký tự'},
                        {validator: async (rule, value) => {
                            const newPassword = form.getFieldValue('newPassword');
                            if(value !== newPassword){
                                throw new Error('Mật khẩu không giống');
                            }
                            
                        }}
					]}
				>
					<Input.Password
						type="password"
						placeholder="Nhập lại mật khẩu mới"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default ModalChangePassword