import { Alert, message, Modal } from "antd";
import { FC, useContext, useState } from "react";
import { useUserApi } from "../../apis/useUserApi";
import {
	UserActionType,
	UserContext,
	UserCtx,
} from "../../context/user/user.context";

interface IProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const ResetPasswordUserModal: FC<IProps> = ({
	isModalVisible,
	setIsModalVisible,
}) => {
	const userApi = useUserApi();
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	const hideModalHandler = () => {
		setIsModalVisible(false);
		dispatch({ type: UserActionType.SET_CURRENT_USER_CLICKED, payload: null });
	};

	const resetPasswordUserHandler = async () => {
		setIsLoading(true);
		if (!state.currentUser) return;
		const { id } = { ...state.currentUser };
		try {
			const { data } = await userApi.resetPassword({ UserId: id });
			setNewPassword(data.data);
			setIsLoading(false);
			message.success("Đổi mật khẩu thành công");
		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
		}
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
					message={`Bạn có muốn cài đặt mật khẩu người dùng: ${state.currentUser?.name} ?`}
					showIcon
				/>
			) : (
				<Alert
					type="info"
					message={`Bạn có muốn cài đặt mật khẩu người dùng: ${state.currentUser?.name} ?`}
					description={`Mật khẩu đã được đổi thành: ${newPassword}`}
					showIcon
				/>
			)}
		</Modal>
	);
};

export default ResetPasswordUserModal;
