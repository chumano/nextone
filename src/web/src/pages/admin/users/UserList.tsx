import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import PaginationInfo from "../../../components/pagination/PaginationInfo";
import { DEFAULT_PAGE_SIZE, IUser } from "../../../utils";

interface IProp {
    loading?: 'pending' | 'idle'
    users: IUser[],
    totalUser: number,

    pagingChanged : (pagingData: {page:number, pageSize:number}) => void,
    openUserDetail: (user: IUser) => void
}

const UserList: React.FC<IProp> = ({
    totalUser,
    users,

    pagingChanged,
    openUserDetail
}) => {

    const [pagingData, setPagingData] = useState({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE
    });

    useEffect(()=>{
        pagingChanged(pagingData);
    },[pagingData]);
    

    const onPageChange = (page: number) => {
        if (page != pagingData.page) {
            setPagingData({
                ...pagingData,
                page: page
            });
        }
    }

    const onPageSizeChange = (pageSize: number) => {
        if (pageSize != pagingData.pageSize) {
            setPagingData({
                ...pagingData,
                pageSize: pageSize
            });
        }
    }
    return <>
        <div className="user-list">
            <Table size="small" responsive={true} hover={true}>
                <thead>
                    <tr>
                        <th> Tên </th>
                        <th> Email </th>
                        <th> Quyền </th>
                        <th> Kênh </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length !== 0 ?
                        (
                            users.map((user, index) => (
                                <tr key={user.id}>
                                    <td>
                                        <span className="link-clickable" onClick={() => openUserDetail(user)}>
                                            {user.name}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <button className="delete-btn button button-link">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}> Không có dữ liệu </td>
                            </tr>
                        )}

                </tbody>
            </Table>

            <PaginationInfo
                totalRecord={totalUser}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    </>;
}

export default UserList;