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

import { FC, useCallback, useContext, useEffect, useState } from "react";

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
	filter: {
		textSearch: string;
	}
}

const UserList: FC<IProps> = ({ filter }) => {
	const { state, dispatch } = useContext(UserCtx) as UserContext;

	const [countUser, setCountUser] = useState(0);
	const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] =
		useState(false);
	const [isOpenUpdateUserModal, setIsOpenUpdateUserModal] = useState(false);
	const [isOpenDeleteUserModal, setIsOpenDeleteUserModal] = useState(false);
	const [isGrantedRoleUserModal, setIsGrantedRoleUserModal] = useState(false);

	const onChangePageHandler = (currentPage: number, pageSize: number) => {
		dispatch({
			type: UserActionType.SET_OFFSET_USER_PAGE,
			payload: (currentPage - 1) * state.pageSize,
		});
	};

	const getListUserAsync = async () => {
		const { offset, pageSize } = state;
		const {textSearch} = filter;
		try {
			const { data: listUserData } = await userApi.list(textSearch, {
				offset,
				pageSize,
			}, false,'Date');
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
			payload: { offset, pageSize, textSearch: '' },
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
	}, [state.offset, filter]);

	const activateUserHandler = useCallback(async (
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
			state.data = [...state.data]
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
	},[filter, state.data]);
	
	const onMenuClick = (record:User)=>{
		return (e:any) => {
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
						showSizeChanger: false,
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
						title="Đã kích hoạt?"
						dataIndex="isActive"
						key="isActive"
						render={(_, value, _1) => {
							const { id,name , isActive } = value as User;
							return (
								<Checkbox
									checked={isActive}
									disabled={name==='admin'}
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
								<Button disabled={record.name==='admin'}
									type="default"
									onClick={() => openModalHandler(record, "update")}
								>
									<FontAwesomeIcon icon={faPencilAlt} />
								</Button>
								<Button disabled={record.name==='admin'}
									danger
									onClick={() => openModalHandler(record, "delete")}
								>
									<FontAwesomeIcon icon={faTrash} />
								</Button>
								<Dropdown disabled={record.name==='admin'}
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
