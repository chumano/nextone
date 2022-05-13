import { User } from "../../models/user/User.model";

import {
	faEllipsisH,
	faPencilAlt,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Avatar, Button, Checkbox, Table } from "antd";
import Column from "antd/lib/table/Column";

const data: User[] = [
	{
		Id: "abcd-efgh-ijkl",
		Name: "Elsie",
		Email: "lngmtri@gmail.com",
		Phone: "0933575619",
		Role: {
			UserId: "abcd-efgh-ijkl",
			RoleCode: "12345",
			Role: {
				Code: "Manager",
				Name: "Quan ly",
				Permissions: [],
			},
		},
		IsActive: true,
		IsDeleted: false,
	},
];

const UserList = () => {
	return (
		<Table dataSource={data} rowKey="Id">
			<Column
				title="#"
				key="index"
				render={(_, _1, index) => <span>{index + 1}</span>}
			/>
			<Column
				title="Name"
				key="name"
				render={(_, value, _1) => {
					const { Name } = value as User;
					return (
						<>
							<Avatar
								shape="circle"
								size="small"
								icon={<FontAwesomeIcon icon={faUser} />}
							/>{" "}
							<span>{Name}</span>
						</>
					);
				}}
			></Column>
			<Column title="Email" dataIndex="Email" key="email"></Column>
			<Column title="Phone" dataIndex="Phone" key="phone"></Column>
			<Column
				title="Active ?"
				dataIndex="IsActive"
				key="isactive"
				render={(_, value, _1) => {
					const { IsActive } = value as User;
					return <Checkbox checked={IsActive} />;
				}}
			></Column>
			<Column
				title="Actions"
				key="actions"
				render={(_) => (
					<>
						<Button type="default">
							<FontAwesomeIcon icon={faPencilAlt} />
						</Button>
						<Button type="danger">
							<FontAwesomeIcon icon={faTrash} />
						</Button>
						<Button type="primary">
							<FontAwesomeIcon icon={faEllipsisH} />
						</Button>
					</>
				)}
			></Column>
		</Table>
	);
};

export default UserList;
