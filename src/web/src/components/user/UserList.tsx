import { Avatar, Button, Checkbox, Spin, Table, Dropdown, Menu } from "antd";

import {
	faEllipsisH,
	faPencilAlt,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FC, useEffect, useReducer, useState } from "react";

import { User } from "../../models/user/User.model";
import { useUserApi } from "../../apis/useUserApi";
import { PageOptions } from "../../models/apis/PageOptions.model";

import EditUserFormModal from "./UpdateUserFormModal";

import "../../styles/components/user/user-list.scss";
import DeleteUserModal from "./DeleteUserModal";

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
	GET_LIST_USER_SUCCESS = "GET_LIST_USER_SUCCESS",
	GET_LIST_USER_FAILURE = "GET_LIST_USER_FAILURE",
}

export const userReducer = (
	state: UserState = INITIAL_STATE,
	action: UserAction
) => {
	const { type, payload } = action;

	switch (type) {
		case UserPageActionKind.GET_LIST_USER_SUCCESS:
		case UserPageActionKind.GET_LIST_USER_FAILURE:
			return {
				...state,
				...payload,
			};
	}
};

const userOtherActionMenu = (
	<Menu>
		<Menu.Item key="1">Đổi mật khẩu</Menu.Item>
		<Menu.Item key="2">Cấp quyền</Menu.Item>
	</Menu>
);

interface IProps {
	textSearch: string;
	isModalVisible: boolean;
}

const UserList: FC<IProps> = ({ textSearch, isModalVisible }) => {
	const userApi = useUserApi();
	const [{ isLoading, error, data }, dispatch] = useReducer(
		userReducer,
		INITIAL_STATE
	);

	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

	const [currentUserClicked, setCurrentUserClicked] = useState<User | null>(
		null
	);

	useEffect(() => {
		const getListUser = async () => {
			const response = await userApi.list(new PageOptions());

			const { isSuccess, errorMessage, data } = response.data;

			if (isSuccess) {
				dispatch({
					type: UserPageActionKind.GET_LIST_USER_SUCCESS,
					payload: {
						isLoading: "success",
						error: errorMessage,
						data,
					},
				});
			} else {
				dispatch({
					type: UserPageActionKind.GET_LIST_USER_SUCCESS,
					payload: {
						isLoading: "failure",
						error: errorMessage,
						data,
					},
				});
			}
		};

		getListUser();
	}, [textSearch, isModalVisible, isEditModalVisible, isDeleteModalVisible]);

	if (isLoading === "success") {
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

		return (
			<>
				<Table
					className="user-list-table-container"
					dataSource={data}
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
							const { isActive } = value as User;
							return <Checkbox checked={isActive} />;
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
								<Dropdown overlay={userOtherActionMenu}>
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
			</>
		);
	} else if (isLoading === "failure") return <p>{error}</p>;
	else {
		return (
			<div className="spinner">
				<Spin size="large" />
			</div>
		);
	}
};

export default UserList;
