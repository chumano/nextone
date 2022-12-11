import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom';
import UserAvatar from '../../components/chat/UserAvatar';
import { useMapDispatch, useMapSelector } from '../../context/map/mapContext';
import { mapActions } from '../../context/map/mapStore';
import { Status, UserStatus } from '../../models/user/UserStatus.model'
import { MessageOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface UserItemProps{
    user: UserStatus;
    onClick?:()=>void;
    openConversation? : ()=>void;
}
const UserItem: React.FC<UserItemProps>= ({user, onClick, openConversation})=>{
    return <div className='user-container'>
        <UserAvatar user={{
                ...user,
                status: Status.Online
            }} />
        <div className='user-name clickable' onClick={onClick}>
            <h6>{user.userName}</h6>
        </div>
        <div className='flex-spacer'></div>
        <Button className='button-icon' onClick={openConversation} title="Nhắn tin">
            <MessageOutlined />
        </Button>
    </div>
}
const UserList = () => {
    const history = useHistory();
    const users = useMapSelector(o=>o.onlineUsers);
    const dispatch = useMapDispatch();
    const onUserClick = useCallback((user: UserStatus)=>{
        return ()=>{
            dispatch(mapActions.selectUser(user));
        }
    },[dispatch,mapActions.selectUser])

    const openConversation = useCallback((user: UserStatus)=>{
        return ()=>{
            history.push('/chat', 
            { 
                'action': 'openConversation',
                'user': user
            } as any)
        }
    },[])
    
    return <div className='user-list'>
        {users.length === 0 &&
            <h6>Không có người dùng online</h6>
        }
        {users.map(o => <UserItem key={o.userId} user={o} 
                onClick={onUserClick(o)}
                openConversation={openConversation(o)}

            /> 
        )}
    </div>
}

export default UserList