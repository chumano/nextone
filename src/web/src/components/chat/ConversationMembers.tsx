
import { Button, Icon, List, Modal, Skeleton } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { ConversationMember, MemberRole } from '../../models/conversation/ConversationMember.model';
import { IAppStore } from '../../store';
import { chatActions } from '../../store/chat/chatReducer';
import { ConversationState } from '../../store/chat/ChatState';
import UserAvatar from './UserAvatar';

interface ConversationMembersProp {
    conversation: ConversationState,
}

const ConversationMembers: React.FC<ConversationMembersProp> = ({ conversation }) => {
    const { members } = conversation;
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const dispatch = useDispatch();
    const onMemberRole = (item: ConversationMember) => {
        return () => {
            dispatch(chatActions.showModal({ modal: 'member_role', visible: true, 
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
                onOk: async() => {
                    const response = await comApi.removeMember({
                        conversationId: conversation.id,
                        userMemberId: item.userMember.userId
                    });

                    if(!response.isSuccess){
                        return;
                    }

                    dispatch(chatActions.deleteMember({
                        conversationId : conversation.id,
                        member : item
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

                    <Button shape="circle" className='button-icon' title='Thêm thành viên'
                        onClick={() => {
                            //new channel
                            dispatch(chatActions.showModal({ modal: 'add_member', visible: true, data: conversation }))
                        }}>
                        <Icon type="plus" />
                    </Button>
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
                                        <Button  className='button-icon'  onClick={onMemberRole(item)}>
                                            Cấp quyền
                                        </Button>
                                    }
                                </>,
                                <>
                                    {item.userMember.userId !== userId &&
                                        <Button type='danger' className='button-icon' onClick={onDeleteMember(item)}>
                                            <Icon type="delete" />
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