import { Avatar, Badge, Icon } from 'antd'
import React from 'react'
import { Status, UserStatus } from '../../models/user/UserStatus.model'

interface UserAvatarProps{
    user?: UserStatus
}
const UserAvatar: React.FC<UserAvatarProps> = ({user}) => {
    const status = user?.status == Status.Online ? 'success' : 
        (user?.status == Status.Offline? 'error' : 'warning')
    return (
        <Badge status={status} offset={[-5, 5]}>
            <Avatar>
                <Icon type="user" style={{ color: 'black', fontSize: '20px' }} />
            </Avatar>
        </Badge>
    )
}

export default UserAvatar