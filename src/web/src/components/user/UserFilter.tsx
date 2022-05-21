import Search from "antd/lib/input/Search";
import { FC, Fragment, useEffect, useState } from "react";

interface IProps {
	onSearchHandler: (value: string) => void;
}

const UserFilter: FC<IProps> = ({ onSearchHandler }) => {
	const [textSearch, setTextSearch] = useState("");

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => onSearchHandler(textSearch), 1500);

		return () => clearTimeout(delayDebounceFn);
	}, [textSearch]);

	const onTextSearchHandler = (value: string) => {
		setTextSearch(value);
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
