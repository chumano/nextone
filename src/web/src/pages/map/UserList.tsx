import React from 'react'
import UserAvatar from '../../components/chat/UserAvatar';
import { useMapSelector } from '../../context/map/mapContext';
import { Status, UserStatus } from '../../models/user/UserStatus.model'

interface UserItemProps{
    user: UserStatus;
}
const UserItem: React.FC<UserItemProps>= ({user})=>{
    return <div className='user-container'>
        <UserAvatar user={{
                ...user,
                status: Status.Online
            }} />
        <div className='user-name clickable'>
            <h6>{user.userName}</h6>
        </div>
        
    </div>
}
const UserList = () => {
    const users = useMapSelector(o=>o.onlineUsers);
    return <div className='user-list'>
        {users.length === 0 &&
            <h6>Không có người dùng online</h6>
        }
        {users.map(o =>  <UserItem key={o.userId} user={o} /> )}
    </div>
}

export default UserList