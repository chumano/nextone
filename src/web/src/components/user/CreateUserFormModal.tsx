import {
	faEnvelope,
	faPhone,
	faPlus,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Modal, Form, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";

import { FC, useState } from "react";

const CreateUserFormModal: FC<FormComponentProps> = ({ form }) => {
	const [modalVisible, setModalVisible] = useState(false);

	const hideModal = () => setModalVisible(false);

	const showModal = () => setModalVisible(true);

	const { getFieldDecorator } = form;

	return (
		<>
			<button
				className="button button-primary button--icon-label add-btn"
				onClick={showModal}
			>
				<FontAwesomeIcon icon={faPlus} />
				<span className="button-label"> Thêm mới </span>
			</button>
			<Modal
				title="Thêm người dùng mới"
				visible={modalVisible}
				onOk={hideModal}
				onCancel={hideModal}
			>
				<Form>
					<Form.Item>
						{getFieldDecorator("username", {
							rules: [
								{
									required: true,
									message: "Đây là trường bắt buộc",
								},
							]
						})(
							<Input
								prefix={<FontAwesomeIcon icon={faUser} />}
								type="text"
								placeholder="Tên người dùng"
							/>
						)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator("email", {
							rules: [
								{
									required: true,
									message: "Đây là trường bắt buộc",
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
					<Form.Item>
						{getFieldDecorator("phone", {
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

export default Form.create()(CreateUserFormModal);
