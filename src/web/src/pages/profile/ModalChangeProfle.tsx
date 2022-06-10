import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { userApi } from '../../apis/userApi';
import { User } from '../../models/user/User.model';

interface ModalChangeProfleProps{
    userProfile: User,
    onClose : (isUpdate: boolean)=>void
}

const ModalChangeProfle : React.FC<ModalChangeProfleProps> = ({userProfile, onClose}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			name: userProfile.name,
			email: userProfile.email,
			phone: userProfile.phone,
		});
	}, []);


	const handleOk = async () => {
		await form.validateFields();
		form.submit();
	};
	const onFormFinish = async (values:any) => {
		setIsLoading(true);
	
		const userUpdated = {
			name: values['name'],
			phone: values['phone'],
		};
		try {
			const { isSuccess, errorMessage } = await userApi.updateMyProfile(userUpdated);
			
			if (!isSuccess) {
                message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
                return;
			}

            message.success("Cập nhật thông tin thành công");
			onClose(true);
		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
		} finally{
            setIsLoading(false);
        }
	};

	return (
		<Modal
			title="Cập nhật thông tin"
			visible={true}
			onCancel={()=>{onClose(false);}}
			footer={[
				<Button key="cancel" onClick={()=>{onClose(false);}}>
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
				<Form.Item name='name' label='Tên'
					rules={[
						{ required: true, message: 'Đây là trường bắt buộc' },
						{ min: 4, message: "Tên người dùng phải lớn hơn 4 ký tự" }
					]}
				>
					<Input
						prefix={<FontAwesomeIcon icon={faUser} />}
						type="text"
						placeholder="Tên người dùng"
					/>
				</Form.Item>
				<Form.Item name='email' label='Email'>
						<Input
							disabled
							prefix={<FontAwesomeIcon icon={faEnvelope} />}
							type="email"
							placeholder="Địa chỉ email"
						/>
				</Form.Item>
				<Form.Item name='phone' label='Số điện thoại'
					rules={[
						{
							required: true,
							message: "Đây là trường bắt buộc",
						},
						{
							pattern: /^(\+84|0[1-9])[0-9]{1,12}$/g,
							message: "Số điện thoại không hợp lệ"
						}
					]}
				>
					<Input
						prefix={<FontAwesomeIcon icon={faPhone} />}
						type="text"
						placeholder="Số điện thoại"
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default ModalChangeProfle