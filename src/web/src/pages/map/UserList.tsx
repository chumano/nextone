import React, { useCallback } from 'react'
import UserAvatar from '../../components/chat/UserAvatar';
import { useMapDispatch, useMapSelector } from '../../context/map/mapContext';
import { mapActions } from '../../context/map/mapStore';
import { Status, UserStatus } from '../../models/user/UserStatus.model'

interface UserItemProps{
    user: UserStatus;
    onClick?:()=>void;
}
const UserItem: React.FC<UserItemProps>= ({user, onClick})=>{
    return <div className='user-container'>
        <UserAvatar user={{
                ...user,
                status: Status.Online
            }} />
        <div className='user-name clickable' onClick={onClick}>
            <h6>{user.userName}</h6>
        </div>
        
    </div>
}
const UserList = () => {
    const users = useMapSelector(o=>o.onlineUsers);
    const dispatch = useMapDispatch();
    const onUserClick = useCallback((user: UserStatus)=>{
        return ()=>{
            dispatch(mapActions.selectUser(user));
        }
    },[dispatch,mapActions.selectUser])
    
    return <div className='user-list'>
        {users.length === 0 &&
            <h6>Không có người dùng online</h6>
        }
        {users.map(o =>  <UserItem key={o.userId} user={o} onClick={onUserClick(o)}/> )}
    </div>
}

export default UserList