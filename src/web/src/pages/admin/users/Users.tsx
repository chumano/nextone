
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faUndo,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import '../../../styles/pages/admin-users/users.scss';
import { Table } from 'reactstrap';
import { createNewUser, DEFAULT_PAGE_SIZE, IUser } from '../../../utils';
import { useContext, useEffect, useState } from 'react';
import ModalInfo from '../../../components/modal/ModalInfo';
import PaginationInfo from '../../../components/pagination/PaginationInfo';
import UserDetail from './UserDetail';
import { AppContext, UserContext } from '../../../utils/contexts/AppContext';
import { connect, Provider, useDispatch, useSelector } from 'react-redux';
import { AuthState } from '../../../store';
import {fetchUsers, getAll, IUserStore, userStore} from '../../../store/users/userStore';
import { bindActionCreators } from '@reduxjs/toolkit';

const FakeUserList:IUser[]= [
    {
        id: "id1",
        name :"Loc Hoang",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id2",
        name :"Loc Hoang 2",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    },
    {
        id: "id3",
        name :"Loc Hoang 3",
        email: "loc@mail.com",
        manageChannels:[],
        roles:[]
    }
];

interface IProp {
    users: IUser[],
    getAll: () => void;
}
const Users : React.FC<IProp> = ({
    users,
    getAll
})=>{
    const [totalRecord, setTotalRecord] = useState(210);
    const [userList, setUserList] = useState<IUser[]>([]);
    const [openDetail, setOpenDetail] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const newUser : IUser= createNewUser();
    const [selectedUser,setSelectedUser] = useState(newUser); 
    
    const [dataFilter,setDataFilter] =useState<any>({})
    const [pageSize, setPageSize] = useState(30 ||DEFAULT_PAGE_SIZE);

    const appContext = useContext(AppContext);
    

    useEffect(() => {
        getAll();
    }, [getAll]);
    
    useEffect(()=>{
        setUserList(users ||FakeUserList);
    },[users])

    const getUserData = ()=>{

    }

    useEffect(() => {
        console.log("getUserData:", dataFilter);
        getUserData();
    }, [dataFilter]);

    const onPageChange = (page:number)=>{
        if(page!=dataFilter.page){
            setDataFilter({
                ...dataFilter,
                page: page
            });
        }
    }

    const onPageSizeChange = (pageSize:number)=>{
        if(pageSize!=dataFilter.pageSize){
            setDataFilter({
                ...dataFilter,
                pageSize: pageSize
            });
        }
    }

    const onBtnCreateClick =()=>{
        setSelectedUser(newUser);
        setOpenDetail(true);
        //appContext.userLogIn({name:"loc"});
        //setOpenCreateModal(!openCreateModal);
    }

    const onCloseDetail=()=>{
        setOpenDetail(false);
        //appContext.userLogOut();
        //setOpenCreateModal(!openCreateModal);
    }

    const openUserDetail =(user:IUser) =>{
        setSelectedUser(user);
        setOpenDetail(true);
    }

    const onSaveUser = (user:IUser)=>{
        //save error : pass errors to form

        //save successful then close
        setOpenDetail(false);
    }
    return <>
        <div className={"user-page"+ (openDetail?" display-none":"")}>
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
                            {userList.length !==0?
                            (
                                userList.map((user,index)=>(
                                    <tr key={user.id}>
                                        <td>
                                            <span className="link-clickable" onClick={()=>openUserDetail(user)}>
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
                            ):(
                                <tr>
                                    <td colSpan={5}> Không có dữ liệu </td>
                                </tr> 
                            ) }
                            
                        </tbody>
                    </Table>
                </div>
            
                <PaginationInfo 
                    totalRecord={totalRecord}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            </div>
        </div>
    
        {openCreateModal&&(
            <ModalInfo isOpen={openCreateModal} loading={false}
                 title={"Tạo user mới"} 
                 content="Bạn có muốn tạo mới user không?" 
                 type={'yes-no'}
                 yesNoOptions={{
                    onYes :()=>{setOpenCreateModal(false); },
                    onNo :()=>{setOpenCreateModal(false)}
                 }}
                 okOptions={{
                    onOk :()=>{setOpenCreateModal(false)}
                 }}
                >

            </ModalInfo>
        )}        

        {openDetail&&(
            <UserDetail userData={selectedUser} closeDetail={onCloseDetail} saveData={onSaveUser}> </UserDetail>
        )}                  
    </>;
}

const mapStateToProps = (state : IUserStore) => {
    return {
      users: state.userState.users,
    };
  };
  
const mapDispatchToProps = (dispatch: any) =>{
    return bindActionCreators({
        getAll : fetchUsers,
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps,undefined, {
    context: UserContext
})(Users);
  