import { message, Modal, Select } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import { useRoleApi } from "../../apis/useRoleApi";
import { useUserApi } from "../../apis/useUserApi";
import {
	UserActionType,
	UserContext,
	UserCtx,
} from "../../context/user/user.context";
import { Role } from "../../models/role/Role.model";

const { Option } = Select;

interface IProps {
	isModalVisible: boolean;
	setIsModalVisible: (value: boolean) => void;
}

const GrantedRoleUserFormModal: FC<IProps> = ({
	isModalVisible,
	setIsModalVisible,
}) => {
	const roleApi = useRoleApi();
	const userApi = useUserApi();
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [roleList, setRoleList] = useState<Role[]>([]);
	const [arrayRoleCode, setArrayRoleCode] = useState<string[]>([]);

	useEffect(() => {
		const getRoleListAsync = async () => {
			try {
				const { data } = await roleApi.list();
				setRoleList(data.data);
			} catch (error) {
				message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			}
		};

		getRoleListAsync();
	}, []);

	const hideModalHandler = () => {
		setIsModalVisible(false);
		dispatch({ type: UserActionType.SET_CURRENT_USER_CLICKED, payload: null });
	};

	const grantedRoleUserHandler = async () => {
		setIsLoading(true);
		if (!state.currentUser) return;
		const { id } = { ...state.currentUser };
		try {
			const { data } = await userApi.updateUserRole({
				UserId: id,
				RoleCodes: arrayRoleCode,
			});

			if (data.isSuccess) {
				dispatch({
					type: UserActionType.SET_RELOAD_USER_TABLE,
					payload: true,
				});
				message.success("Cập nhật quyền thành công");
			} else {
				//TODO: Throw error message
				message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			}

			hideModalHandler();
		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
		}
	};

	const onSelectChangeHandler = (values: string[]) => {
		setArrayRoleCode([...values]);
	};

	return (
		<Modal
			title={`Cấp quyền người dùng`}
			okText="Đồng ý"
			cancelText="Huỷ bỏ"
			visible={isModalVisible}
			okButtonProps={{ loading: isLoading }}
			onOk={grantedRoleUserHandler}
			onCancel={hideModalHandler}
		>
			<Select
				style={{ width: "100%" }}
				mode="multiple"
				allowClear
				defaultValue={state.currentUser?.roles?.map((r) => r.roleCode)}
				onChange={onSelectChangeHandler}
			>
				{roleList.map((r) => (
					<Option value={r.code} key={r.code}>
						{r.name}
					</Option>
				))}
			</Select>
		</Modal>
	);
};

export default GrantedRoleUserFormModal;
