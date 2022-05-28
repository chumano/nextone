import { Avatar, Badge } from 'antd';
import { UserOutlined} from '@ant-design/icons';
import React from 'react'
import { Status, UserStatus } from '../../models/user/UserStatus.model'

interface UserAvatarProps{
    user?: UserStatus
}
const UserAvatar: React.FC<UserAvatarProps> = ({user}) => {
    const status = user?.status == Status.Online ? 'success' : 
        (user?.status == Status.Offline? 'error' : 'warning')
    return (
        <Badge dot status={status} offset={[-5, 5]}>
            <Avatar>
                <UserOutlined style={{ color: 'black', fontSize: '20px' }} />
            </Avatar>
        </Badge>
    )
}

export default UserAvatar