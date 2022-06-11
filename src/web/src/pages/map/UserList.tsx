import React from 'react'
import { UserStatus } from '../../models/user/UserStatus.model'

const UserList = () => {
    const users: UserStatus[] = [];
    return <div className='users'>
        {users.length === 0 &&
            <h6>Không có người dùng online</h6>
        }
        {users.map(o => <>
            User
        </>)}
    </div>
}

export default UserList