
import { Button, List, Modal, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined, UserSwitchOutlined, MessageOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationMember, MemberRole } from '../../models/conversation/ConversationMember.model';
import { IAppStore } from '../../store';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';
import UserAvatar from './UserAvatar';
import { CreateConverationDTO } from '../../models/dtos';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { getOrCreateConversation } from '../../store/chat/chatThunks';

interface ConversationMembersProp {
    conversation: ConversationState,
}

const ConversationMembers: React.FC<ConversationMembersProp> = ({ conversation }) => {
    const { members } = conversation;
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const userRole = members.find(o => o.userMember.userId === userId)?.role;
    const dispatch = useDispatch();

    const onMemberChat = (item: ConversationMember) => {
        return () => {
            const conversation: CreateConverationDTO = {
                name: '',
                type: ConversationType.Peer2Peer,
                memberIds: [item.userMember.userId]
            }
            dispatch(getOrCreateConversation(conversation))
        }
    }

    const onMemberRole = (item: ConversationMember) => {
        return () => {
            dispatch(chatActions.showModal({
                modal: 'member_role', visible: true,
                data: {
                    conversation,
                    member: item
                }
            }))
        }
    }

    const onDeleteMember = (item: ConversationMember) => {
        return () => {
            Modal.confirm({
                title: 'Bạn có muốn xóa thành viên không?',
                onOk: async () => {
                    const response = await comApi.removeMember({
                        conversationId: conversation.id,
                        userMemberId: item.userMember.userId
                    });

                    if (!response.isSuccess) {
                        return;
                    }

                    dispatch(chatActions.deleteMember({
                        conversationId: conversation.id,
                        member: item
                    }));
                },
                onCancel() {
                },
            });
        }
    }
    return <>
        <div className="conversation-members">
            <div className="conversation-members__header">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <h5>Thành viên ({members.length})</h5>
                    <div className='flex-spacer'></div>

                    {userRole === MemberRole.MANAGER &&
                        <Button shape="circle" className='button-icon' title='Thêm thành viên'
                            onClick={() => {
                                //new channel
                                dispatch(chatActions.showModal({ modal: 'add_member', visible: true, data: conversation }))
                            }}>
                            <PlusOutlined />
                        </Button>
                    }

                </div>

                {/* <div className="search-container">
                    <input type="search" className="form-control" ></input>
                </div> */}

            </div>
            <div className="conversation-members__body">
                <List
                    className="member-list"
                    loading={false}
                    itemLayout="horizontal"
                    dataSource={members}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <>
                                    {item.userMember.userId !== userId &&
                                        <Button className='button-icon' onClick={onMemberChat(item)} title="Nhắn tin">
                                            <MessageOutlined />
                                        </Button>
                                    }
                                </>,
                                <>
                                    {item.userMember.userId !== userId && userRole === MemberRole.MANAGER &&
                                        <Button className='button-icon' onClick={onMemberRole(item)} title="Cấp quyền">
                                            <UserSwitchOutlined />
                                        </Button>
                                    }
                                </>,
                                <>
                                    {item.userMember.userId !== userId && userRole === MemberRole.MANAGER &&
                                        <Button danger className='button-icon' onClick={onDeleteMember(item)} title="Xóa thành viên">
                                            <DeleteOutlined />
                                        </Button>
                                    }
                                </>
                            ]}
                        >
                            <Skeleton avatar title={true} loading={false} active>
                                <List.Item.Meta
                                    avatar={
                                        <UserAvatar user={item.userMember} />
                                    }
                                    title={item.userMember.userName}
                                    description={MemberRole[item.role]}
                                />
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </div>
        </div>

    </>
}

export default ConversationMembers;