import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, message, Modal } from "antd";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { useUserApi } from "../../apis/useUserApi";
import {
	UserActionType,
	UserContext,
	UserCtx,
} from "../../context/user/user.context";

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
	return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface UpdateUserFormData {
	Username: string;
	Email: string;
	Phone: string;
}

interface IProps{
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const UpdateUserFormModal: FC<IProps> = ({
	isModalVisible,
	setIsModalVisible,
}) => {
	const userApi = useUserApi();
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		const { name, email, phone } = { ...state.currentUser };
		form.setFieldsValue({
			name: name,
			email: email,
			phone: phone,
		});
	}, []);

	const hideModalHandler = () => {
		setIsModalVisible(false);
		dispatch({ type: UserActionType.SET_CURRENT_USER_CLICKED, payload: null });
	};

	const handleOk = async () => {
		await form.validateFields();
		form.submit();
	};
	const onFormFinish = async (values:any) => {
		setIsLoading(true);
	
		const userUpdated = {
			...state.currentUser,
			name: values['name'],
			phone: values['phone'],
		};
		const { id, name, phone, email } = userUpdated;
		try {
			const { data } = await userApi.updateUser({
				UserId: id!,
				Name: name,
				Phone: phone,
				Email: email!,
				RoleCodes: [],
			});
			setIsLoading(false);
			if (data.isSuccess) {
				dispatch({
					type: UserActionType.SET_RELOAD_USER_TABLE,
					payload: true,
				});
				message.success("Cập nhật thông tin thành công");
			} else {
				//TODO: Throw error message
				message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			}
			hideModalHandler();
		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
		}
	};

	return (
		<Modal
			title="Cập nhật người dùng"
			visible={isModalVisible}
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
};

export default UpdateUserFormModal;
