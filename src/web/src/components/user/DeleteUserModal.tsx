import { Alert, Modal } from "antd";
import { FC, useState } from "react";
import { useUserApi } from "../../apis/useUserApi";
import { User } from "../../models/user/User.model";

interface IProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
	userNeedToDelete: User | null;
}

const DeleteUserModal: FC<IProps> = ({
	setIsModalVisible,
	isModalVisible,
	userNeedToDelete,
}) => {
	const userApi = useUserApi();
	const [isLoading, setIsLoading] = useState(false);

	const hideModalHandler = () => setIsModalVisible(false);

	const deleteUserHandler = async () => {
		setIsLoading(true);
		if (!userNeedToDelete) return;
		const { id } = { ...userNeedToDelete };
		await userApi.deleteUser(id);
		setIsLoading(false);

		hideModalHandler();
	};

	return (
		<Modal
			title={`Xoá người dùng`}
			okText="Đồng ý"
			cancelText="Huỷ bỏ"
			visible={isModalVisible}
			okButtonProps={{ type: "danger", loading: isLoading }}
			onOk={deleteUserHandler}
			onCancel={hideModalHandler}
		>
			<Alert
				type="error"
				message={`Bạn có muốn xoá người dùng: ${userNeedToDelete?.name} ?`}
			/>
		</Modal>
	);
};

export default DeleteUserModal;
