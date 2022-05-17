import { Alert, Modal } from "antd";
import { FC, useState } from "react";
import { useUserApi } from "../../apis/useUserApi";
import { User } from "../../models/user/User.model";

interface IProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
	userNeedToResetPassword: User | null;
}

const ResetPasswordUserModal: FC<IProps> = ({
	isModalVisible,
	setIsModalVisible,
	userNeedToResetPassword,
}) => {
	const userApi = useUserApi();
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	const hideModalHandler = () => {
		setIsModalVisible(false);
	};

	const resetPasswordUserHandler = async () => {
		setIsLoading(true);
		if (!userNeedToResetPassword) return;
		const { id } = { ...userNeedToResetPassword };
		const { data } = await userApi.resetPassword({ UserId: id });

		setNewPassword(data.data);

		setIsLoading(false);
	};

	return (
		<Modal
			visible={isModalVisible}
			title="Cài đặt lại mật khẩu người dùng"
			okText="Đồng ý"
			cancelText="Huỷ bỏ"
			okButtonProps={{ loading: isLoading, disabled: newPassword !== "" }}
			onOk={resetPasswordUserHandler}
			onCancel={hideModalHandler}
		>
			{newPassword === "" ? (
				<Alert
					type="info"
					message={`Bạn có muốn cài đặt mật khẩu người dùng: ${userNeedToResetPassword?.name} ?`}
					showIcon
				/>
			) : (
				<Alert
					type="info"
					message={`Bạn có muốn cài đặt mật khẩu người dùng: ${userNeedToResetPassword?.name} ?`}
					description={`Mật khẩu đã được đổi thành: ${newPassword}`}
					showIcon
				/>
			)}
		</Modal>
	);
};

export default ResetPasswordUserModal;
