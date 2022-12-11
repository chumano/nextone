import Search from "antd/lib/input/Search";
import { FC, Fragment, useEffect, useState } from "react";

interface IProps {
	onSearchHandler: (filter: {textSearch: string}) => void;
}

const UserFilter: FC<IProps> = ({ onSearchHandler }) => {


	const onTextSearchHandler = (value: string) => {
		onSearchHandler({
			textSearch: value
		})
	};

	return (
		<Fragment>
			<div className="filter-inputs">
				<div className="input-label-group">
					<Search
						placeholder="Tìm kiếm người dùng"
						onSearch={onTextSearchHandler}
						enterButton
					/>
				</div>
			</div>
		</Fragment>
	);
};

export default UserFilter;
