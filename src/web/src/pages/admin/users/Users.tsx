
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faUndo,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import '../../../styles/pages/admin-users/users.scss';
import { Table } from 'reactstrap';
import { createNewUser, DEFAULT_PAGE_SIZE, IUser, useDebounce } from '../../../utils';
import { Dispatch, useContext, useEffect, useState } from 'react';
import ModalInfo from '../../../components/modal/ModalInfo';
import PaginationInfo from '../../../components/pagination/PaginationInfo';
import UserDetail from './UserDetail';
import { connect, Provider, useDispatch, useSelector } from 'react-redux';
import { AuthState } from '../../../store';
import { fetchUsers, IUserStore, UserContext, userStore } from '../../../store/users/userStore';
import { bindActionCreators } from '@reduxjs/toolkit';
import usePrevious from '../../../utils/hooks/usePrevious';
import UserList from './UserList';

interface IProp {
    loading: 'pending' | 'idle'
    users: IUser[],
    totalUser: number,
    getUsers: (filters?: any) => void;
}
const Users: React.FC<IProp> = ({
    loading,
    users,
    totalUser,
    getUsers
}) => {
    const [openDetail, setOpenDetail] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [dataFilter, setDataFilter] = useState<any>({});
    const newUser: IUser = createNewUser();
    const [selectedUser, setSelectedUser] = useState(newUser);

    const debounceGetUsers = useDebounce((dataFilter) => {
        console.log("getUserData:", dataFilter);
        getUsers(dataFilter)
    }, 500);

    useEffect(() => {
        console.log("new datas")
    }, [users, totalUser]);

    useEffect(() => {
        //if(loading=='pending') return;
        debounceGetUsers(dataFilter)
    }, [dataFilter, getUsers]);


    const onPagingChange = (pagingData: { page: number, pageSize: number }) => {
        setDataFilter({
            ...dataFilter,
            ...pagingData
        });
    }

    const onBtnCreateClick = () => {
        setSelectedUser(newUser);
        setOpenDetail(true);
        //setOpenCreateModal(!openCreateModal);
    }

    const openUserDetail = (user: IUser) => {
        setSelectedUser(user);
        setOpenDetail(true);
    }

    const onSaveUser = (user: IUser) => {
        //save error : pass errors to form

        //save successful then close
        setOpenDetail(false);
    }

    const onCloseDetail = () => {
        setOpenDetail(false);
        //appContext.userLogOut();
        //setOpenCreateModal(!openCreateModal);
    }

    return <>
        <div className={"user-page" + (openDetail ? " display-none" : "")}>
            <div className="user-page__head">
                <div className="user-page__head--left">
                    <span className="page-title">
                        Người dùng
                    </span>

                    <span className="page-subtitle">
                        Quản lý và phân quyền người dùng
                    </span>
                </div>
                <div className="flex-spacer"></div>
                <div className="user-page__head--right">
                    <button className="button button-primary button--icon-label add-btn" onClick={onBtnCreateClick}>
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

                <div className="filter-actions">
                    <button className="button button-primary">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>

                    <span className="reset-btn">
                        <FontAwesomeIcon icon={faUndo} />
                    </span>
                </div>
            </div>

            <div className="user-page__body">
                <UserList
                    users={users}
                    totalUser={totalUser}
                    openUserDetail={openUserDetail}
                    pagingChanged={onPagingChange}
                ></UserList>
            </div>
        </div>

        {openCreateModal && (
            <ModalInfo isOpen={openCreateModal} loading={false}
                title={"Tạo user mới"}
                content="Bạn có muốn tạo mới user không?"
                type={'yes-no'}
                yesNoOptions={{
                    onYes: () => { setOpenCreateModal(false); },
                    onNo: () => { setOpenCreateModal(false) }
                }}
                okOptions={{
                    onOk: () => { setOpenCreateModal(false) }
                }}
            />
        )}

        {openDetail && (
            <UserDetail userData={selectedUser} closeDetail={onCloseDetail} saveData={onSaveUser}> </UserDetail>
        )}
    </>;
}

const mapStateToProps = (state: IUserStore) => {
    return {
        loading: state.userState.loading,
        totalUser: state.userState.totalUser,
        users: state.userState.users,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getUsers: fetchUsers,
    }, dispatch);
}
const ConnectedUsers = connect(mapStateToProps, mapDispatchToProps, undefined, {
    context: UserContext
})(Users);

export default () => {
    return <>
        <Provider context={UserContext} store={userStore}>
            <ConnectedUsers />
        </Provider>
    </>
}