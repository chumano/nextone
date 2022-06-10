import { Button, Descriptions } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { userApi } from '../../apis/userApi'
import { User } from '../../models/user/User.model';
import '../../styles/pages/userprofile/userprofile-page.scss';
import ModalChangePassword from './ModalChangePassword';
import ModalChangeProfle from './ModalChangeProfle';

const ProfilePage = () => {
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<User>();
    const [showModalChangePassword, setShowModalChangePassword] = useState(false);
    const [showModalChangeProfile, setShowModalChangeProfile] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        const response = await userApi.getMyProfile();
        setLoading(false);
        if (!response.isSuccess) {
            return;
        }

        setUserProfile(response.data);
    }, [userApi]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile])

    return <div className='userprofile-page'>
        {!loading && userProfile && <>

            <Descriptions title="Thông tin người dùng" bordered>
                <Descriptions.Item label="Tên" span={3}>
                    {userProfile.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>
                    {userProfile.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại" span={3}>
                    {userProfile.phone}
                </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 20 }}>
                <Button type="default" onClick={() => {
                    setShowModalChangeProfile(true);
                }}>
                    Thay đổi thông tin
                </Button>
                <Button type="default" style={{ marginLeft: '20px' }} onClick={() => {
                    setShowModalChangePassword(true);
                }}>
                    Đổi mật khẩu
                </Button>
            </div>
        </>
        }
        {showModalChangeProfile && userProfile && <ModalChangeProfle
            userProfile={userProfile} onClose={(isUpdate) => {
                setShowModalChangeProfile(false);
                if (isUpdate) {
                    fetchProfile();
                }
            }} />}

        {showModalChangePassword && userProfile && <ModalChangePassword
            userProfile={userProfile} onClose={() => {
                setShowModalChangePassword(false);
            }} />}
    </div>
}

export default ProfilePage