import UserFilter from "../../components/user/UserFilter";
import UserList from "../../components/user/UserList";

import { useState } from "react";

import "../../styles/pages/user/user.scss";
import CreateUserModal from "../../components/user/CreateUserFormModal";

const UserPage = () => {
	const [searchInput, setSearchInput] = useState("");

	const searchHandler = (value: string) => {
		setSearchInput(value);
	};

	return (
		<>
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
						<CreateUserModal />
					</div>
				</div>

				<div className="user-page__filter">
					<UserFilter onSearchHandler={searchHandler} />
				</div>

				<div className="user-page__body">
					<UserList textSearch={searchInput} />
				</div>
			</div>
		</>
	);
};

export default UserPage;
