import UserFilter from "../../components/user/UserFilter";
import UserList from "../../components/user/UserList";

import { useState } from "react";

import CreateUserModal from "../../components/user/CreateUserFormModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "../../styles/pages/user/user.scss";

const UserPage = () => {
	const [searchInput, setSearchInput] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);

	const searchHandler = (value: string) => {
		setSearchInput(value);
	};

	const isModalVisibleHandler = (value: boolean) => {
		setIsModalVisible(value);
	};

	const openModal = () => setIsModalVisible(true);

	return (
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
						onClick={openModal}
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
				<UserList isModalVisible={isModalVisible} textSearch={searchInput} />
			</div>

			{isModalVisible && (
				<CreateUserModal
					isModalVisible={isModalVisible}
					setIsModalVisible={isModalVisibleHandler}
				/>
			)}
		</div>
	);
};

export default UserPage;
