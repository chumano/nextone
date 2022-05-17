import { Avatar, Button, Checkbox, Spin, Table, Dropdown, Menu } from "antd";

import {
	faEllipsisH,
	faPencilAlt,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FC, useEffect, useReducer, useState } from "react";

import { ActivateUserRequest, User } from "../../models/user/User.model";
import { useUserApi } from "../../apis/useUserApi";
import { PageOptions } from "../../models/apis/PageOptions.model";

import EditUserFormModal from "./UpdateUserFormModal";

import "../../styles/components/user/user-list.scss";
import DeleteUserModal from "./DeleteUserModal";
import ResetPasswordUserModal from "./ResetPasswordUserModal";

interface UserState {
	data: User[];
	isLoading: "loading" | "success" | "failure";
	error: string | null;
}

interface UserAction {
	type: UserPageActionKind;
	payload: UserState;
}

const INITIAL_STATE: UserState = {
	data: [],
	isLoading: "loading",
	error: null,
};

enum UserPageActionKind {
	REQUEST_USER_API_SUCCESS = "REQUEST_USER_API_SUCCESS",
	REQUEST_USER_API_FAILURE = "REQUEST_USER_API_FAILURE",
}

export const userReducer = (state: UserState, action: UserAction) => {
	const { type, payload } = action;

	switch (type) {
		case UserPageActionKind.REQUEST_USER_API_SUCCESS:
		case UserPageActionKind.REQUEST_USER_API_FAILURE:
			return {
				...state,
				...payload,
			};
		default:
			throw Error("Not support this action type from UserPageActionKind");
	}
};

interface IProps {
	textSearch: string;
	isCreateModalVisible: boolean;
}

const UserList: FC<IProps> = ({ textSearch, isCreateModalVisible }) => {
	const userApi = useUserApi();
	const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
	const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
		useState(false);

	const [currentUserClicked, setCurrentUserClicked] = useState<User | null>(
		null
	);

	useEffect(() => {
		const getListUser = async () => {
			const response = await userApi.list(new PageOptions());

			const { isSuccess, errorMessage, data } = response.data;

			if (isSuccess) {
				dispatch({
					type: UserPageActionKind.REQUEST_USER_API_SUCCESS,
					payload: {
						isLoading: "success",
						error: errorMessage,
						data,
					},
				});
			} else {
				dispatch({
					type: UserPageActionKind.REQUEST_USER_API_FAILURE,
					payload: {
						isLoading: "failure",
						error: errorMessage,
						data,
					},
				});
			}
		};

		getListUser();
	}, [
		textSearch,
		isCreateModalVisible,
		isEditModalVisible,
		isDeleteModalVisible,
	]);

	if (state.isLoading === "success") {
		const isEditModalVisibleHandler = (value: boolean) =>
			setIsEditModalVisible(value);

		const openEditModalHandler = (userNeedToUpdate: User) => {
			setIsEditModalVisible(true);
			setCurrentUserClicked(userNeedToUpdate);
		};

		const openDeleteModalHandler = (userNeedToDelete: User) => {
			setIsDeleteModalVisible(true);
			setCurrentUserClicked(userNeedToDelete);
		};

		const openResetModalHandler = (userNeedToResetPassword: User) => {
			setIsResetPasswordModalVisible(true);
			setCurrentUserClicked(userNeedToResetPassword);
		};

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
					type: UserPageActionKind.REQUEST_USER_API_SUCCESS,
					payload: {
						isLoading: "success",
						error: errorMessage,
						data: state.data,
					},
				});
			} else {
				dispatch({
					type: UserPageActionKind.REQUEST_USER_API_FAILURE,
					payload: {
						isLoading: "failure",
						error: errorMessage,
						data: state.data,
					},
				});
			}
		};

		return (
			<>
				<Table
					className="user-list-table-container"
					dataSource={state.data}
					bordered
					rowKey="id"
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
									onClick={() => openEditModalHandler(record)}
								>
									<FontAwesomeIcon icon={faPencilAlt} />
								</Button>
								<Button
									type="danger"
									onClick={() => openDeleteModalHandler(record)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</Button>
								<Dropdown
									overlay={
										<Menu>
											<Menu.Item
												key="1"
												onClick={() => openResetModalHandler(record)}
											>
												Đổi mật khẩu
											</Menu.Item>
											<Menu.Item key="2">Cấp quyền</Menu.Item>
										</Menu>
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

				{isEditModalVisible && (
					<EditUserFormModal
						isModalVisible={isEditModalVisible}
						setIsModalVisible={isEditModalVisibleHandler}
						userNeedToUpdate={currentUserClicked}
					/>
				)}

				{isDeleteModalVisible && (
					<DeleteUserModal
						isModalVisible={isDeleteModalVisible}
						setIsModalVisible={setIsDeleteModalVisible}
						userNeedToDelete={currentUserClicked}
					/>
				)}

				{isResetPasswordModalVisible && (
					<ResetPasswordUserModal
						isModalVisible={isResetPasswordModalVisible}
						setIsModalVisible={setIsResetPasswordModalVisible}
						userNeedToResetPassword={currentUserClicked}
					/>
				)}
			</>
		);
	} else if (state.isLoading === "failure") return <p>{state.error}</p>;
	else {
		return (
			<div className="spinner">
				<Spin size="large" />
			</div>
		);
	}
};

export default UserList;
