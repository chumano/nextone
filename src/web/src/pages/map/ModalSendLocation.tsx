import { Checkbox, Input, List, message, Modal, Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { comApi } from '../../apis/comApi';
import { userApi } from '../../apis/userApi';
import ConversationAvatar from '../../components/chat/ConversationAvatar';
import UserAvatar from '../../components/chat/UserAvatar';
import Loading from '../../components/controls/loading/Loading';
import { ApiResult } from '../../models/apis/ApiResult.model';
import { Conversation } from '../../models/conversation/Conversation.model';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { SearchResult, SendMessageDTO } from '../../models/dtos';
import { User } from '../../models/user/User.model';
import { handleAxiosApi } from '../../utils/functions';

interface ModalSendLocationProps {
    position: [number, number],
    onVisible: (visible: boolean) => void;
}
const ModalSendLocation: React.FC<ModalSendLocationProps> = ({position, onVisible }) => {
    const [loading, setLoading] = useState(true);
    const [useList, setUserList] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>();

    const [channelList, setChannelList] = useState<Conversation[]>([]);
    const [selectedChannelId, setSelectedChannelId] = useState<string>();
    const [content, setContent] = useState<string>();

    const [sending, setSending] = useState(false);

    const search = useCallback(async (textSearch: string) => {
        setLoading(true);
        try{
            const userResponse = await handleAxiosApi<ApiResult<User[]>>(userApi.list(textSearch, { offset: 0, pageSize: 5 }, true));
       
            if (userResponse.isSuccess) {
                setUserList(userResponse.data);
            } else {
                setUserList([])
            }
    
            const channelResponse = await comApi.search({
                textSearch: textSearch,
                conversationType: ConversationType.Channel
            });
            if (channelResponse.isSuccess) {
                setChannelList(channelResponse.data.conversations);
            } else {
                setChannelList([])
            }
        }
        finally{
            setLoading(false);
        }
       
    }, [userApi,comApi, setChannelList, setUserList]);

    const searchDebounce = useMemo(() => {
        return debounce(search, 500);
    }, [search])

    const onTextSearchChange = useCallback((value: string) => {
        searchDebounce(value);
    }, [searchDebounce]);

    
    useEffect(()=>{
        search('')
    },[search])

    const handleOk = async () => {
        //send message
        setSending(true)
        try{
            const data: SendMessageDTO = {
                content: content?.trim() || '',
                conversationId: selectedChannelId || '',
                userId: selectedUserId,
                properties: {
                    "LOCATION": position
                }
            }
            const response = await comApi.sendMessage(data);
            if(!response.isSuccess){
                message.error(response.errorMessage)
                return;
            }

            onVisible(false);
        }finally{
            setSending(false)
        }
       
    };

    const handleCancel = () => {
        onVisible(false);
    };

    return (
        <Modal
            title={'Gửi thông tin vị trí'}
            confirmLoading={sending}
            visible={true}
            okButtonProps={{
                disabled: !content?.trim()|| (!selectedUserId && !selectedChannelId)
            }}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <div style={{marginBottom: 5}}>
                <label >Vị trí: [{position[0].toFixed(2)} , {position[1].toFixed(2)} ]</label>
            </div>
            <div style={{marginBottom: 10}}>
                <Input.TextArea rows={2} placeholder="Nội dung" 
                    value={content} onChange={(e)=> setContent(e.target.value)}
                    maxLength={200} />
            </div>
            <Input.Search
                placeholder="Tìm kiếm"
                onChange={(event) => onTextSearchChange(event.target.value)}
                onSearch={value => onTextSearchChange(value)}
            />
            {loading &&
                <Loading/>
            }
            <div style={{maxHeight: 300, overflowY:'auto'}}>
                
            {useList.length > 0 && <>
                <h6>Người dùng</h6>
                <List
                className="user-list"
                loading={loading}
                itemLayout="horizontal"
                dataSource={useList}
                renderItem={(item, index) => (
                    <List.Item className='clickable'
                        onClick={() => {
                            setSelectedChannelId(undefined);
                            setSelectedUserId(item.id)
                        }}
                        actions={[
                            <Checkbox checked={selectedUserId === item.id} onChange={(e) => {
                                const checked = e.target.value;
                                setSelectedChannelId(undefined);
                                setSelectedUserId(item.id)
                            }} />
                        ]}
                    >
                        <Skeleton avatar title={false} loading={false} active >
                            <List.Item.Meta
                                avatar={
                                    <UserAvatar />
                                }
                                title={item.name}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
            </>}

            {channelList.length > 0 && <>
                <h6>Kênh</h6>
                <List
                className="conversation-list"
                loading={loading}
                itemLayout="horizontal"
                dataSource={channelList}
                renderItem={(item, index) => (
                    <List.Item className='clickable'
                        onClick={() => {
                            setSelectedUserId(undefined);
                            setSelectedChannelId(item.id)
                        }}
                        actions={[
                            <Checkbox checked={selectedChannelId === item.id} onChange={(e) => {
                                const checked = e.target.value;
                                setSelectedUserId(undefined);
                                setSelectedChannelId(item.id)
                            }} />
                        ]}
                    >
                        <Skeleton avatar title={false} loading={false} active >
                            <List.Item.Meta
                                avatar={
                                    <ConversationAvatar />
                                }
                                title={item.name}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
            </>}
            
            </div>
            
        </Modal>
    )
}

export default ModalSendLocation