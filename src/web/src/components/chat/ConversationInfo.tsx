import { Button, Modal, Tabs } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { Channel } from '../../models/channel/Channel.model';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { ConversationState } from '../../store/chat/ChatState';
import ChannelEvents from '../channel/ChannelEvents';
import ConversationMembers from './ConversationMembers';
import { deleteConversation } from '../../store/chat/chatThunks';
import { IAppStore } from '../../store';
import { MemberRole } from '../../models/conversation/ConversationMember.model';
const { TabPane } = Tabs;

interface ConversationInfoProps {
    conversation: ConversationState
}

const ConversationInfo: React.FC<ConversationInfoProps> = ({ conversation }) => {
    const dispatch = useDispatch();
    const channel = conversation as Channel;
    const user = useSelector((store: IAppStore) => store.auth.user);
    const userId = user!.profile.sub;
    const { members } = channel;
    const userRole = members.find(o => o.userMember.userId === userId)?.role;
    const systemUserRole = user?.profile.role;
    const onTabChange = (key: string) => {

    }
    const onDeleteConversation = useCallback(() => {
        Modal.confirm({
            title: `Bạn có muốn xóa "${conversation.name}" không?`,
            onOk: async () => {
                dispatch(deleteConversation(conversation.id));
            },
            onCancel() {
            },
        });
    }, [dispatch, conversation]);

    return (
        <div className='chat-info'>
            <Tabs defaultActiveKey="channel" style={{ height: "100%" }}
                onChange={onTabChange}>
                {conversation.type == ConversationType.Channel &&
                    <TabPane tab="Kênh" key="channel">
                        <div className='conversation-info'>
                            <div className='conversation-info__header'>
                                <h6 style={{ textAlign: 'center' }}>{conversation.name}</h6>

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    { (systemUserRole === 'admin' && userRole === MemberRole.MANAGER) &&
                                        <Button danger className="button-icon" ghost
                                            onClick={onDeleteConversation}>
                                            <DeleteOutlined /> Xóa
                                        </Button>
                                    }
                                </div>

                            </div>
                            <div className='conversation-info__body'>
                                Loại sự kiện:
                                {channel.allowedEventTypes.map(o =>
                                    <div key={o.code} style={{ fontWeight: 600 }}>
                                        {o.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabPane>
                }
                {conversation.type == ConversationType.Channel &&
                    <TabPane tab="Sự kiện" key="events">
                        <ChannelEvents events={channel.events} />
                    </TabPane>
                }

                <TabPane tab="Thành viên" key="members">
                    <ConversationMembers conversation={conversation} />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default ConversationInfo