import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, Form, Input, Button, message } from "antd";
import { FormComponentProps } from "antd/lib/form";

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

const hasErrors = (fieldsError: Record<string, string[] | undefined>) => {
	return Object.keys(fieldsError).some((field) => fieldsError[field]);
};

interface IProps extends FormComponentProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const CreateUserFormModal: FC<FormComponentProps & IProps> = ({
	form,
	isModalVisible,
	setIsModalVisible,
}) => {
	const userApi = useUserApi();
	const { dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [emailValidate, setEmailValidate] = useState("");

	const {
		getFieldDecorator,
		getFieldsError,
		getFieldError,
		isFieldTouched,
		validateFields,
	} = form;

	useEffect(() => {
		validateFields();
	}, []);

	const hideModalHandler = () => setIsModalVisible(false);

	const userNameError = isFieldTouched("Username") && getFieldError("Username");
	const emailError = isFieldTouched("Email") && getFieldError("Email");
	const phoneError = isFieldTouched("Phone") && getFieldError("Phone");

	const onFormSubmitHandler = (event: FormEvent) => {
		event.preventDefault();
		setEmailValidate("")
		setIsLoading(true);
		validateFields(
			async (_, { Username, Email, Phone }: CreateUserFormData) => {
				try {
					const { data } = await userApi.createUser({
						Name: Username,
						Email,
						Phone,
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
						//TODO: Throw error message
						setEmailValidate("Địa chỉ email đã có người đăng ký");
					}

				
				} catch (error) {
					message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
					setIsLoading(false);
				}
			}
		);
	};

	return (
		<Modal
			title="Thêm người dùng mới"
			visible={isModalVisible}
			onCancel={hideModalHandler}
			footer={[
				<Button key="back" onClick={hideModalHandler}>
					Huỷ bỏ
				</Button>,
				<Button
					form="create-user-form"
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
			<Form onSubmit={onFormSubmitHandler} id="create-user-form">
				<Form.Item
					validateStatus={userNameError ? "error" : ""}
					help={userNameError || ""}
				>
					{getFieldDecorator("Username", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
							{
								min: 4,
								message: "Tên người dùng phải lớn hơn 4 ký tự"
							}
						],
					})(
						<Input
							prefix={<FontAwesomeIcon icon={faUser} />}
							type="text"
							placeholder="Tên người dùng"
						/>
					)}
				</Form.Item>
				<Form.Item
					validateStatus={emailError ? "error" : ""}
					help={emailError || ""}

					{...emailValidate !== '' && {
						validateStatus:"error",
						help: emailValidate
					}}
				>
					{getFieldDecorator("Email", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
							{
								type: "email",
								message: "Địa chỉ email không hợp lệ",
							},
						],
					})(
						<Input
							prefix={<FontAwesomeIcon icon={faEnvelope} />}
							type="email"
							placeholder="Địa chỉ email"
						/>
					)}
				</Form.Item>
				<Form.Item
					validateStatus={phoneError ? "error" : ""}
					help={phoneError || ""}
				>
					{getFieldDecorator("Phone", {
						rules: [
							{
								required: true,
								message: "Đây là trường bắt buộc",
							},
							{
								pattern: /^(\+84|0[1-9])[0-9]{1,12}$/g,
								message: "Số điện thoại không hợp lệ"
							}
						],
					})(
						<Input
							prefix={<FontAwesomeIcon icon={faPhone} />}
							type="text"
							placeholder="Số điện thoại"
						/>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default Form.create<IProps>({ name: "create-user-form" })(
	CreateUserFormModal
);
