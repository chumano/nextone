import Search from "antd/lib/input/Search";
import { FC } from "react";

interface IProps {
    onSearchHandler: (value: string) => void
}

const UserFilter: FC<IProps> = ({ onSearchHandler }) => {
	return (
		<>
			<div className="filter-inputs">
				<div className="input-label-group">
					<Search
						placeholder="Tìm kiếm người dùng"
						onSearch={onSearchHandler}
						enterButton
					/>
				</div>
			</div>
		</>
	);
};

export default UserFilter;
