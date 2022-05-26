import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, Form, Input, Button, message } from "antd";

import { FC, FormEvent, useContext, useEffect, useState } from "react";

import { useUserApi } from "../../apis/useUserApi";
import {
	UserActionType,
	UserContext,
	UserCtx,
} from "../../context/user/user.context";

interface CreateUserFormData {
	Username: string;
	Email: string;
	Phone: string;
}


interface IProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const CreateUserFormModal: FC<IProps> = ({
	isModalVisible,
	setIsModalVisible,
}) => {
	const userApi = useUserApi();
	const { dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();

	const hideModalHandler = () => setIsModalVisible(false);

	const handleOk = async () => {
		await form.validateFields();
		form.submit();
	};

	const onFormFinish = async (values: any) => {
		console.log({values});
		setIsLoading(true);
		try {
			const { data } = await userApi.createUser({
				Name: values['name'],
				Email: values['email'],
				Phone: values['phone'],
			});

			setIsLoading(false);
			if (data.isSuccess) {
				dispatch({
					type: UserActionType.SET_RELOAD_USER_TABLE,
					payload: true,
				});
				message.success("Thêm người dùng thành công");
				hideModalHandler();

			} else {
				// form.setFields([
				// 	{
				// 	  name: 'email',
				// 	  errors: ["Địa chỉ email đã có người đăng ký"],
				// 	},
				//  ]);
				message.error(data.errorMessage);
			}


		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			setIsLoading(false);
		}
	};

	return (
		<Modal
			title="Thêm người dùng mới"
			visible={isModalVisible}
			onCancel={hideModalHandler}
			footer={[
				<Button key="canncel" onClick={hideModalHandler}>
					Huỷ bỏ
				</Button>,
				<Button key='ok'
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
			<Form onFinish={onFormFinish} layout='vertical' form={form} >
				<Form.Item name="name" label="Tên"
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
				<Form.Item name="email" label="Email"
					rules={[
						{
							required: true,
							message: "Đây là trường bắt buộc",
						},
						{
							type: "email",
							message: "Địa chỉ email không hợp lệ",
						},
					]}
				>
					<Input
						prefix={<FontAwesomeIcon icon={faEnvelope} />}
						type="email"
						placeholder="Địa chỉ email"
					/>
				</Form.Item>
				<Form.Item  name="phone" label="Số điện thoại"
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
};

export default CreateUserFormModal;
