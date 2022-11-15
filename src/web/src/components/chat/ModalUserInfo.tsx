import { Button, Descriptions, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { userApi } from '../../apis/userApi';
import { User } from '../../models/user/User.model';
import { UserStatus } from '../../models/user/UserStatus.model';
import { handleAxiosApi } from '../../utils/functions';
import Loading from '../controls/loading/Loading';

interface ModalUserInfoProps {
    userStatus: UserStatus,
    onVisible: (visible: boolean) => void;
}
const ModalUserInfo: React.FC<ModalUserInfoProps> = ({ onVisible, userStatus }) => {

    const [user, setUser] = useState<User>();

    const handleCancel = () => {
        onVisible(false);
    };

    useEffect(() => {
        const fetchUser = async (userId: string) => {
            try {
                const response = await userApi.getUser(userId);
                if (response.isSuccess) {
                    setUser(response.data);
                }
            } catch (error) {
            }
        };

        fetchUser(userStatus?.userId);
    }, [userStatus]);


    return (
        <Modal
            title={`${userStatus.userName}`}
            visible={true}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Đóng
                </Button>

            ]}
        >
            {!user && <Loading />}
            {user &&
                <Descriptions bordered layout='horizontal' column={1}>
                    <Descriptions.Item label="Tên">{user.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Điện thoại">{user.phone}</Descriptions.Item>
                </Descriptions>
            }

        </Modal>
    )
}

export default ModalUserInfo