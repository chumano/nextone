import { faEnvelope, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, message, Modal } from "antd";
import { FormComponentProps } from "antd/lib/form";
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

interface IProps extends FormComponentProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const UpdateUserFormModal: FC<FormComponentProps & IProps> = ({
	form,
	isModalVisible,
	setIsModalVisible,
}) => {
	const userApi = useUserApi();
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const {
		setFieldsValue,
		getFieldDecorator,
		getFieldsError,
		getFieldError,
		isFieldTouched,
		validateFields,
	} = form;
	useEffect(() => {
		const { name, email, phone } = { ...state.currentUser };
		setFieldsValue({
			Username: name,
			Email: email,
			Phone: phone,
		});
	}, []);

	const hideModalHandler = () => {
		setIsModalVisible(false);
		dispatch({ type: UserActionType.SET_CURRENT_USER_CLICKED, payload: null });
	};

	const onFormSubmitHandler = (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		validateFields(async (_, { Username, Phone }: UpdateUserFormData) => {
			if (!state.currentUser) return;

			const userUpdated = {
				...state.currentUser,
				name: Username,
				phone: Phone,
			};
			const { id, name, phone, email } = userUpdated;
			try {
				const { data } = await userApi.updateUser({
					UserId: id,
					Name: name,
					Phone: phone,
					Email: email,
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
		});
	};

	const userNameError = isFieldTouched("Username") && getFieldError("Username");
	const phoneError = isFieldTouched("Phone") && getFieldError("Phone");

	return (
		<Modal
			title="Cập nhật người dùng"
			visible={isModalVisible}
			onCancel={hideModalHandler}
			footer={[
				<Button key="back" onClick={hideModalHandler}>
					Huỷ bỏ
				</Button>,
				<Button
					form="update-user-form"
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
			<Form onSubmit={onFormSubmitHandler} id="update-user-form">
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
						],
					})(
						<Input
							prefix={<FontAwesomeIcon icon={faUser} />}
							type="text"
							placeholder="Tên người dùng"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator("Email")(
						<Input
							disabled
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

export default Form.create<IProps>({ name: "update-user-form" })(
	UpdateUserFormModal
);
