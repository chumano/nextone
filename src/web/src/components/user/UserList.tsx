import {
	Avatar,
	Button,
	Checkbox,
	Spin,
	Table,
	Dropdown,
	Menu,
	message,
} from "antd";

import {
	faEllipsisH,
	faPencilAlt,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FC, useContext, useEffect, useState } from "react";

import { ActivateUserRequest, User } from "../../models/user/User.model";
import { userApi } from "../../apis/userApi";

import DeleteUserModal from "./DeleteUserModal";
import ResetPasswordUserModal from "./ResetPasswordUserModal";
import UpdateUserFormModal from "./UpdateUserFormModal";
import GrantedRoleUserFormModal from "./GrantedRoleUserFormModal";
import type { MenuProps } from 'antd';

import {
	UserActionType,
	UserContext,
	UserCtx,
} from "../../context/user/user.context";

import "../../styles/components/user/user-list.scss";

interface IProps {
	textSearch: string;
}

const UserList: FC<IProps> = ({ textSearch }) => {
	const { state, dispatch } = useContext(UserCtx) as UserContext;

	const [countUser, setCountUser] = useState(0);
	const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] =
		useState(false);
	const [isOpenUpdateUserModal, setIsOpenUpdateUserModal] = useState(false);
	const [isOpenDeleteUserModal, setIsOpenDeleteUserModal] = useState(false);
	const [isGrantedRoleUserModal, setIsGrantedRoleUserModal] = useState(false);

	const onChangePageHandler = (currentPage: number) => {
		dispatch({
			type: UserActionType.SET_OFFSET_USER_PAGE,
			payload: (currentPage - 1) * state.pageSize,
		});
	};

	const getListUserAsync = async () => {
		const { offset, pageSize } = state;

		try {
			const { data: listUserData } = await userApi.list(textSearch, {
				offset,
				pageSize,
			});
			const { data: countUser } = await userApi.count(textSearch);

			if (listUserData.isSuccess) {
				dispatch({
					type: UserActionType.GET_LIST_USER_SUCCESS,
					payload: listUserData.data,
				});
			} else {
				dispatch({
					type: UserActionType.GET_LIST_USER_FAILED,
					payload: listUserData.errorMessage,
				});

				//TODO: throw error message
				message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			}

			if (countUser.isSuccess) {
				setCountUser(countUser.data);
			} else {
				//TODO: throw error message
				message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
			}
		} catch (error) {
			message.error("Lỗi hệ thống, xin vui lòng kiểm tra lại");
		}
	};

	useEffect(() => {
		const { offset, pageSize } = state;
		dispatch({
			type: UserActionType.GET_LIST_USER,
			payload: { offset, pageSize, textSearch },
		});
	}, []);

	useEffect(() => {
		if (state.isReloadTable) {
			getListUserAsync();
			dispatch({
				type: UserActionType.SET_RELOAD_USER_TABLE,
				payload: false,
			});
		}
	}, [state.isReloadTable]);

	useEffect(() => {
		getListUserAsync();
	}, [state.offset, textSearch]);

	const activateUserHandler = async (
		userNeedToActivated: ActivateUserRequest
	) => {
		const response = await userApi.activateUser(userNeedToActivated);
		const { isSuccess, errorMessage } = response.data;
		if (isSuccess) {
			const updateUserRowIndex = state.data.findIndex(
				(u) => u.id === userNeedToActivated.UserId
			);
			const updateUserRow: User = {
				...state.data[updateUserRowIndex],
				id: userNeedToActivated.UserId,
				isActive: userNeedToActivated.IsActive,
			};
			state.data[updateUserRowIndex] = updateUserRow;

			dispatch({
				type: UserActionType.GET_LIST_USER_SUCCESS,
				payload: state.data,
			});
		} else {
			dispatch({
				type: UserActionType.GET_LIST_USER_FAILED,
				payload: errorMessage,
			});
		}
	};
	
	const onMenuClick = (record:User)=>{
		return (e:any) => {
			console.log('click ', e);
			const {key} = e;
			openModalHandler(record, key);
		};
	}

	const openModalHandler = (
		record: User,
		modalType: "reset-password" | "update" | "delete" | "granted-role"
	) => {
		dispatch({
			type: UserActionType.SET_CURRENT_USER_CLICKED,
			payload: record,
		});
		switch (modalType) {
			case "reset-password":
				setIsOpenResetPasswordModal(true);
				return;
			case "update":
				setIsOpenUpdateUserModal(true);
				return;
			case "delete":
				setIsOpenDeleteUserModal(true);
				return;
			case "granted-role":
				setIsGrantedRoleUserModal(true);
				return;
		}
	};

	if (state.status === "loading") {
		return (
			<div className="spinner">
				<Spin size="large" />
			</div>
		);
	} else if (state.status === "success") {
		return (
			<>
				<Table
					className="user-list-table-container"
					dataSource={state.data}
					bordered
					rowKey="id"
					pagination={{
						total: countUser,
						pageSize: state.pageSize,
						onChange: onChangePageHandler,
					}}
				>
					<Table.Column
						title="#"
						key="index"
						render={(_, _1, index) => <span>{index + 1}</span>}
					/>
					<Table.Column
						title="Tên người dùng"
						key="name"
						render={(_, value, _1) => {
							const { name } = value as User;
							return (
								<>
									<Avatar
										shape="circle"
										size="small"
										icon={<FontAwesomeIcon icon={faUser} />}
									/>{" "}
									<span>{name}</span>
								</>
							);
						}}
					></Table.Column>
					<Table.Column
						title="Email"
						dataIndex="email"
						key="email"
					></Table.Column>
					<Table.Column
						title="Số điện thoại"
						dataIndex="phone"
						key="phone"
					></Table.Column>
					<Table.Column
						align="center"
						title="Active?"
						dataIndex="isActive"
						key="isActive"
						render={(_, value, _1) => {
							const { id, isActive } = value as User;
							return (
								<Checkbox
									checked={isActive}
									onChange={(e) =>
										activateUserHandler({
											UserId: id,
											IsActive: e.target.checked,
										})
									}
								/>
							);
						}}
					></Table.Column>
					<Table.Column
						key="actions"
						align="right"
						render={(_, record: User) => (
							<div className="list-button-actions">
								<Button
									type="default"
									onClick={() => openModalHandler(record, "update")}
								>
									<FontAwesomeIcon icon={faPencilAlt} />
								</Button>
								<Button
									danger
									onClick={() => openModalHandler(record, "delete")}
								>
									<FontAwesomeIcon icon={faTrash} />
								</Button>
								<Dropdown
									overlay={
										<Menu items={[
											{ label: 'Đổi mật khẩu', key: 'reset-password' }, // remember to pass the key prop
											{ label: 'Cấp quyền', key: 'granted-role' }, // which is required
										]}
											onClick={onMenuClick(record)}
										/>
									}
								>
									<Button type="primary">
										<FontAwesomeIcon icon={faEllipsisH} />
									</Button>
								</Dropdown>
							</div>
						)}
					></Table.Column>
				</Table>
				{isOpenResetPasswordModal && (
					<ResetPasswordUserModal
						isModalVisible={isOpenResetPasswordModal}
						setIsModalVisible={setIsOpenResetPasswordModal}
					/>
				)}
				{isOpenDeleteUserModal && (
					<DeleteUserModal
						isModalVisible={isOpenDeleteUserModal}
						setIsModalVisible={setIsOpenDeleteUserModal}
					/>
				)}
				{isOpenUpdateUserModal && (
					<UpdateUserFormModal
						isModalVisible={isOpenUpdateUserModal}
						setIsModalVisible={setIsOpenUpdateUserModal}
					/>
				)}
				{isGrantedRoleUserModal && (
					<GrantedRoleUserFormModal
						isModalVisible={isGrantedRoleUserModal}
						setIsModalVisible={setIsGrantedRoleUserModal}
					/>
				)}
			</>
		);
	} else {
		return <p>{state.errorMessage}</p>;
	}
};

export default UserList;
