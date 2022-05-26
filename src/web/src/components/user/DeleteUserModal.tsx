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

const DeleteUserModal: FC<IProps> = ({ setIsModalVisible, isModalVisible }) => {
	const userApi = useUserApi();
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);

	const hideModalHandler = () => {
		setIsModalVisible(false);
		dispatch({ type: UserActionType.SET_CURRENT_USER_CLICKED, payload: null });
	};

	const deleteUserHandler = async () => {
		setIsLoading(true);
		if (!state.currentUser) return;
		const { id } = { ...state.currentUser };
		try {
			const { data } = await userApi.deleteUser(id);
			setIsLoading(false);

			if (data.isSuccess) {
				dispatch({
					type: UserActionType.SET_RELOAD_USER_TABLE,
					payload: true,
				});
				message.success("Xoá người dùng thành công");
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
			title={`Xoá người dùng`}
			okText="Đồng ý"
			cancelText="Huỷ bỏ"
			visible={isModalVisible}
			okButtonProps={{ danger: true, loading: isLoading }}
			onOk={deleteUserHandler}
			onCancel={hideModalHandler}
		>
			<Alert
				type="error"
				message={`Bạn có muốn xoá người dùng: ${state.currentUser?.name} ?`}
			/>
		</Modal>
	);
};

export default DeleteUserModal;
