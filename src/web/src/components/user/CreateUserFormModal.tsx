import {
	faEnvelope,
	faPhone,
	faPlus,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, Form, Input, Button } from "antd";
import { FormComponentProps } from "antd/lib/form";

import { FC, FormEvent, useEffect, useState } from "react";
import { useUserApi } from "../../apis/useUserApi";

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
	setModalVisible: (value: boolean) => void;
}

const CreateUserFormModal: FC<FormComponentProps & IProps> = ({
	form,
	isModalVisible,
	setModalVisible,
}) => {
	const userApi = useUserApi();

	const [isLoading, setIsLoading] = useState(false);

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

	const hideModalHandler = () => setModalVisible(false);

	const showModalHandler = () => setModalVisible(true);

	const userNameError = isFieldTouched("username") && getFieldError("username");
	const emailError = isFieldTouched("email") && getFieldError("email");
	const phoneError = isFieldTouched("phone") && getFieldError("phone");

	const onFormSubmitHandler = (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		validateFields(
			async (_, { Username, Email, Phone }: CreateUserFormData) => {
				await userApi.create({ Name: Username, Email, Phone });
				setIsLoading(false);

				hideModalHandler();
			}
		);
	};

	return (
		<>
			<button
				className="button button-primary button--icon-label add-btn"
				onClick={showModalHandler}
			>
				<FontAwesomeIcon icon={faPlus} />
				<span className="button-label"> Thêm mới </span>
			</button>
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
		</>
	);
};

export default Form.create<IProps>({ name: "create-user-form" })(
	CreateUserFormModal
);
