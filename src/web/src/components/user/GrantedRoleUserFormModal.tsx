import { message, Modal, Select } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import { roleApi } from "../../apis/roleApi";
import { userApi } from "../../apis/userApi";
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
	const { state, dispatch } = useContext(UserCtx) as UserContext;
	const [isLoading, setIsLoading] = useState(false);
	const [roleList, setRoleList] = useState<Role[]>([]);
	const [arrayRoleCode, setArrayRoleCode] = useState<string[]>([]);

	
	const [selectedRoles, setSelectedRoles] = useState<string>();

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

	useEffect(()=>{
		if(!state.currentUser) return;
		if(!state.currentUser.roles  ||  state.currentUser.roles?.length == 0) return;
		//const selectedRole = state.currentUser?.roles?.map((r) => r.roleCode);
		setSelectedRoles(state.currentUser.roles[0].roleCode);
	},[state.currentUser, roleList]);

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

	const onSelectChangeHandler = (value: string | string[]) => {
		if(typeof(value) === 'string'){
			setArrayRoleCode([value]);
			setSelectedRoles(value);
		}else{
			setArrayRoleCode([...value]);
			setSelectedRoles(value[0]);
		}
		
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
				allowClear
				value={selectedRoles}
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
