import UserFilter from "../../components/user/UserFilter";
import UserList from "../../components/user/UserList";
import CreateUserModal from "../../components/user/CreateUserFormModal";

import UserProvider from "../../context/user/user.context";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "../../styles/pages/user/user.scss";

const UserPage = () => {
	const [searchInput, setSearchInput] = useState("");
	const [isOpenCreateUserModal, SetIsOpenCreateUserModal] = useState(false);

	const searchHandler = (value: string): void => {
		setSearchInput(value);
	};

	const onCreateUserModalHandler = () => SetIsOpenCreateUserModal(true);

	return (
		<UserProvider>
			<div className="user-page">
				<div className="user-page__head">
					<div className="user-page__head--left">
						<span className="page-title">Người dùng</span>
						<span className="page-subtitle">
							Quản lý và phân quyền người dùng
						</span>
					</div>
					<div className="flex-spacer"></div>
					<div className="user-page__head--right">
						<button
							className="button button-primary button--icon-label add-btn"
							onClick={onCreateUserModalHandler}
						>
							<FontAwesomeIcon icon={faPlus} />
							<span className="button-label"> Thêm mới </span>
						</button>
					</div>
				</div>

				<div className="user-page__filter">
					<UserFilter onSearchHandler={searchHandler} />
				</div>

				<div className="user-page__body">
					<UserList textSearch={searchInput} />
				</div>

				{isOpenCreateUserModal && (
					<CreateUserModal
						isModalVisible={isOpenCreateUserModal}
						setIsModalVisible={SetIsOpenCreateUserModal}
					/>
				)}
			</div>
		</UserProvider>
	);
};

export default UserPage;
