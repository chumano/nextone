import { Button, Input, message, Modal, Tabs, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined,CloseOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { comApi } from '../../apis/comApi';
import { Channel, SubChannel } from '../../models/channel/Channel.model';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { ConversationState } from '../../store/chat/ChatState';
import ChannelEvents from '../channel/ChannelEvents';
import ConversationMembers from './ConversationMembers';
import { deleteConversation } from '../../store/chat/chatThunks';
import { IAppStore } from '../../store';
import { MemberRole } from '../../models/conversation/ConversationMember.model';
import ConversationSubChannels from './ConversationSubChannels';
import ModalSubchannelCreation from './ModalSubchannelCreattion';
import { EventInfo } from '../../models/event/Event.model';
import { chatActions } from '../../store/chat/chatReducer';
const { TabPane } = Tabs;

const { Text } = Typography;

interface ConversationInfoProps {
    conversation: ConversationState,
    userRole?: MemberRole,
    onDeleteEvent?: (item: EventInfo) => void
}

const ConversationInfo: React.FC<ConversationInfoProps> = ({ conversation, userRole, onDeleteEvent }) => {
    const dispatch = useDispatch();
    const channel = conversation as Channel;
    const user = useSelector((store: IAppStore) => store.auth.user);
    const [subchannels, setSubchannels] = useState<SubChannel[]>();
    const [modalSubchannelCreattionVisible, setModalSubchannelCreattionVisible] = useState(false)

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

    useEffect(() => {
        if (conversation.type !== ConversationType.Channel) {
            setSubchannels(undefined);
            return;
        }

        const getSubChannels = async () => {
            const response = await comApi.getSubChannels(conversation.id)
            if (response.isSuccess) {
                setSubchannels(response.data);
            } else {
                setSubchannels(undefined);
                message.error(response.errorMessage)
            }

        }
        getSubChannels();
    }, [conversation])

    return (
        <div className='chat-info'>
            <Tabs defaultActiveKey="channel" style={{ height: "100%" }}
                onChange={onTabChange}>
                {conversation.type == ConversationType.Channel &&
                    <TabPane tab="Kênh" key="channel">
                        <div className='conversation-info'>
                            <div className='conversation-info__header'>

                                <ConversationEditableName conversation={conversation} userRole={userRole} />

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    {(systemUserRole === 'admin' || userRole === MemberRole.MANAGER) &&
                                        <Button danger className="button-icon" ghost
                                            onClick={onDeleteConversation}>
                                            <DeleteOutlined /> Xóa
                                        </Button>
                                    }
                                </div>

                            </div>
                            <div className='conversation-info__body'>
                                Loại sự kiện:
                                <div>
                                    {channel.allowedEventTypes.map(o =>
                                        <div key={o.code} style={{ fontWeight: 600, textAlign: 'center' }}>
                                            {o.name}
                                        </div>
                                    )}
                                </div>

                            </div>

                            {channel.channelLevel !== 2 && subchannels &&
                                <>
                                    <div className='conversation-info__subchannels'>
                                        <div className='' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                            <Button onClick={() => {
                                                setModalSubchannelCreattionVisible(true)
                                            }} >Tạo kênh con</Button>
                                        </div>

                                        <ConversationSubChannels channelId={conversation.id} channelName={conversation.name} subchannels={subchannels} />
                                    </div>
                                </>
                            }

                        </div>
                    </TabPane>
                }
                {conversation.type == ConversationType.Channel &&
                    <TabPane tab="Sự kiện" key="events">
                        <ChannelEvents channel={channel} userRole={userRole} 
                            onDeleteEvent={onDeleteEvent}/>
                    </TabPane>
                }

                <TabPane tab="Thành viên" key="members">
                    <ConversationMembers conversation={conversation} userRole={userRole} />
                </TabPane>
            </Tabs>

            {modalSubchannelCreattionVisible &&
                <ModalSubchannelCreation parentId={conversation.id} parentName={conversation.name}
                    onVisible={(visible) => {
                        setModalSubchannelCreattionVisible(visible)
                    }} />
            }
        </div>
    )
}

export default ConversationInfo

const ConversationEditableName: React.FC<{
    conversation: ConversationState,
    userRole?: MemberRole
}> = ({ conversation, userRole }) => {
    const dispatch = useDispatch();
    const isEditable = conversation.type !== ConversationType.Peer2Peer && userRole === MemberRole.MANAGER;
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>(conversation.name)

    const onEdit =  () => {
        setIsEditing(true);
    }
    const onCloseEditing = ()=>{
        setIsEditing(false);
    }

    const onSaved = async (name: string) => {
        setIsEditing(false);
        setName(name);
        dispatch(chatActions.updateConversationName({ id: conversation.id, name }))
    }
    const MAX_LENGTH = 25;
    const displayName = name.length >= MAX_LENGTH?  name.substring(0,MAX_LENGTH-3)+'...' : name;
    return <>
        {!isEditing && <h6 style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }} >
            <span title={name}>{displayName}</span>
            {isEditable && <EditOutlined title='Thay đổi tên' className='clickable' style={{ marginLeft: 5 }} onClick={onEdit} />}
        </h6>}
        {isEditing && <EditingName conversationId={conversation.id}
            name={name}
            onSaved={onSaved}
            onClose={onCloseEditing} />}
    </>

}

const EditingName: React.FC<{
    conversationId: string,
    name: string,
    onSaved?: (name: string) => void,
    onClose?: ()=>void
}> = ({ conversationId, name, onSaved, onClose }) => {
    const [cname, setName] = useState<string>(name)
    const [error, setError] = useState<string>()

    const validate = () => {
        let isValid = true;
        let error = '';
        if (!cname) {
            setError('Thông tin bắt buộc')
            return false;
        }

        if (cname.length < 5) {
            setError('Số kí tự tối thiểu là 5')
            return false;
        }

        if (cname.length > 50) {
            setError('Số kí tự tối đa là 50')
            return false;
        }
        setError(error)
        return isValid
    }
    const onSave = async () => {

        if (!validate()) {
            return;
        }
        try{
            const response = await comApi.updateName(conversationId, cname)
            if(!response.isSuccess){
                message.error("Có lỗi bất thường: " + response.errorMessage);
                return;
            }
            onSaved && onSaved(cname)
        }catch(err){
            message.error("Có lỗi hệ thống");
        }
       
    }
    return <>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5
        }}>
            <Input value={cname} maxLength={50} allowClear  onChange={(evt) => {
                setName(evt.target.value)
            }} />
            <SaveOutlined title='Lưu' className='clickable' style={{ marginLeft: 5, fontSize:20 }} onClick={onSave} />
            <CloseOutlined title='Hủy' className='clickable' style={{ marginLeft: 5, fontSize:20 }} onClick={onClose}/>

        </div>
        {error && <Text type="danger">{error}</Text>}
    </>
}