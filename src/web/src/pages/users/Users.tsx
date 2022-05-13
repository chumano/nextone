import { Fragment } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";

import "../../styles/pages/users/users.scss";
import UserList from "./UserList";

const UsersPage = () => {
	return (
		<Fragment>
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
						<button className="button button-primary button--icon-label add-btn">
							<FontAwesomeIcon icon={faPlus} />
							<span className="button-label"> Thêm mới </span>
						</button>
					</div>
				</div>

				<div className="user-page__filter">
					<div className="filter-inputs">
						<div className="input-label-group">
							<span className="label">Tìm kiếm: </span>
							<input className="input" />
						</div>
					</div>

					<div className="flex-spacer"></div>

					{/* <div className="filter-actions">
						<button className="button button-primary">
							<FontAwesomeIcon icon={faSearch} />
						</button>

						<span className="reset-btn">
							<FontAwesomeIcon icon={faUndo} />
						</span>
					</div> */}
				</div>

				<div className="user-page__body">
					<UserList />
				</div>
			</div>
		</Fragment>
	);
};

export default UsersPage;
