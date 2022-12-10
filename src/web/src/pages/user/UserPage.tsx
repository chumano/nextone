import UserFilter from "../../components/user/UserFilter";
import UserList from "../../components/user/UserList";
import CreateUserModal from "../../components/user/CreateUserFormModal";

import UserProvider from "../../context/user/user.context";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "../../styles/pages/user/user.scss";
import { useSelector } from "react-redux";
import { IAppStore } from "../../store";
import NoPermission from "../../components/auth/NoPermission";

const UserPage = () => {
	const [filter, setFilter] = useState<{textSearch: string}>({textSearch:""});
	const [isOpenCreateUserModal, SetIsOpenCreateUserModal] = useState(false);


	const searchHandler = (filter:any): void => {
		setFilter(filter);
	};

	const onCreateUserModalHandler = () => SetIsOpenCreateUserModal(true);

    const user = useSelector((store: IAppStore) => store.auth.user);
    const systemUserRole = user?.profile.role;
    if(systemUserRole !== 'admin'){
        return <NoPermission/>
    }

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
					<UserList filter={filter} />
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
