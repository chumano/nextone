import { Checkbox, Input, List, message, Modal, Radio, Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { comApi } from '../../apis/comApi';
import { userApi } from '../../apis/userApi';
import ConversationAvatar from '../../components/chat/ConversationAvatar';
import UserAvatar from '../../components/chat/UserAvatar';
import Loading from '../../components/controls/loading/Loading';
import { AppWindow } from '../../config/AppWindow';
import { ApiResult } from '../../models/apis/ApiResult.model';
import { Conversation } from '../../models/conversation/Conversation.model';
import { ConversationType } from '../../models/conversation/ConversationType.model';
import { SearchResult, SendMessage2ConversationsDTO, SendMessage2UsersDTO, SendMessageDTO } from '../../models/dtos';
import { User } from '../../models/user/User.model';
import { GlobalContext } from '../../utils/contexts/AppContext';
import { handleAxiosApi } from '../../utils/functions';
declare let window: AppWindow;

interface DistanceUser {
    id: string,
    name: string,
    distance? : number
}
interface ModalSendLocationProps {
    position: [number, number],
    searchType: 'users'|'near',
    onVisible: (visible: boolean) => void;
}
const ModalSendLocation: React.FC<ModalSendLocationProps> = ({searchType, position, onVisible }) => {
    const globalData = useContext(GlobalContext)
    const {applicationSettings} = globalData;

    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState<DistanceUser[]>([]);
    //const [selectedUserId, setSelectedUserId] = useState<string>();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>();
    //const [searchType, setSearchType] = useState<'users'|'near'>('users');

    const [channelList, setChannelList] = useState<Conversation[]>([]);
    const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>();
    const [content, setContent] = useState<string>();

    const [sending, setSending] = useState(false);

    const search = useCallback(async (textSearch: string) => {
        setLoading(true);
        try{
            const userResponse = await handleAxiosApi<ApiResult<User[]>>(userApi.list(textSearch, { offset: 0, pageSize: 5 }, true));
       
            if (userResponse.isSuccess) {
                setUserList(userResponse.data.map(o=>({
                    id: o.id,
                    name: o.name,
                    distance: undefined 
                })));
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

    const findNearUsers = useCallback(async (distance: number)=>{
        setLoading(true);
        try{
            const userResponse =await comApi.findNearUsers(
                position[0],
                position[1],
                distance
            )
           
            if (userResponse.isSuccess) {
                var {data} = userResponse;
                setUserList(data.map(o=> ({
                    id: o.user.userId,
                    name: o.user.userName,
                    distance: o.distanceInMeter
                 })));
                 
            } else {
                setUserList([])
            }
        }
        finally{
            setLoading(false);
        }
    },[comApi, position])

    useEffect(()=>{
        if(searchType=='near'){
            setSelectedChannelIds(undefined)
            setSelectedUserIds(undefined);
            setChannelList([])
            findNearUsers(applicationSettings?.maxFindUserDistanceInMeters || 5000)
        }
    },[searchType, findNearUsers, applicationSettings])

    useEffect(()=>{
        if(searchType=='users'){
            search('')
        }
    },[searchType, search])


    const searchDebounce = useMemo(() => {
        return debounce(search, 500);
    }, [search])

    const onTextSearchChange = useCallback((value: string) => {
        searchDebounce(value);
    }, [searchDebounce]);

    

    const handleOk = async () => {
        //send message
        setSending(true)
        try{
            if(selectedChannelIds){
                const data: SendMessage2ConversationsDTO = {
                    content: content?.trim() || '',
                    conversationIds: selectedChannelIds || '',
                   
                    properties: {
                        "LOCATION": position
                    }
                }
                const response = await comApi.sendMessage2Conversations(data);
                if(!response.isSuccess){
                    message.error(response.errorMessage)
                    return;
                }
            }else if(selectedUserIds && selectedUserIds.length>0){
                const data: SendMessage2UsersDTO = {
                    content: content?.trim() || '',
                    userIds: selectedUserIds,
                    properties: {
                        "LOCATION": position
                    }
                }
                const response = await comApi.sendMessage2User(data);
                if(!response.isSuccess){
                    message.error(response.errorMessage)
                    return;
                }
            }
            onVisible(false);
        }finally{
            setSending(false)
        }
       
    };

    const handleCancel = () => {
        onVisible(false);
    };


    const onUserSelect = useCallback((userId: string)=>{
        setSelectedChannelIds(undefined);

        let userIds = selectedUserIds || []
        if(userIds?.indexOf(userId)==-1){
            userIds.push(userId)
        }else{
            userIds = userIds.filter(id =>id !== userId);
        }
        setSelectedUserIds([...userIds])
    },[selectedUserIds])

    const onConversationSelect = useCallback((conversationId: string)=>{
        setSelectedUserIds(undefined);

        let conversationIds = selectedChannelIds || []
        if(conversationIds.indexOf(conversationId)==-1){
            conversationIds.push(conversationId)
        }else{
            conversationIds = conversationIds.filter(id =>id !== conversationId);
        }
        setSelectedChannelIds([...conversationIds])
    },[selectedChannelIds])

    return (
        <Modal
            title={'Gửi thông tin vị trí'}
            confirmLoading={sending}
            visible={true}
            okButtonProps={{
                disabled: !content?.trim() || 
                !( (selectedUserIds && selectedUserIds.length>0 ) 
                    || (selectedChannelIds && selectedChannelIds.length>0 ) 
                )
            }}
            onOk={handleOk}
            okText='Đồng ý'
            onCancel={handleCancel}
            cancelText='Hủy bỏ'
        >
            <div style={{marginBottom: 5}}>
                <label >Vị trí: [{position[0].toFixed(2)} , {position[1].toFixed(2)} ]</label>
            </div>
            <div style={{marginBottom: 10}}>
                <Input.TextArea rows={2} placeholder="Nội dung" 
                    value={content} onChange={(e)=> setContent(e.target.value)}
                    maxLength={200} />
            </div>


            {/* <Radio.Group
                options={[{ label: 'Tìm bởi tên', value: 'users' },
                { label: 'Tìm gần đây', value: 'near' },]}
                onChange={(e)=>{ setSearchType(e.target.value)}}
                value={searchType}
                optionType="button"
                buttonStyle="solid"
            /> */}

            {searchType  == 'users' && 
                <Input.Search
                    placeholder="Tìm kiếm"
                    onChange={(event) => onTextSearchChange(event.target.value)}
                    onSearch={value => onTextSearchChange(value)}
                />
            }

            {loading &&
                <Loading/>
            }
            <div style={{maxHeight: 300, overflowY:'auto'}}>
            
            {!loading && searchType==='near' && userList.length === 0 &&<>
                Không tìm thấy người dùng
            </>}
            {userList.length > 0 && <>
                <h6>Người dùng</h6>
                <List
                className="user-list"
                loading={loading}
                itemLayout="horizontal"
                dataSource={userList}
                renderItem={(item, index) => (
                    <List.Item className='clickable'
                        onClick={() => {
                            onUserSelect(item.id)
                        }}
                        actions={[
                            <Checkbox checked={selectedUserIds && selectedUserIds.indexOf(item.id)!==-1}
                                onClick={(e) => {
                                    //onUserSelect(item.id)
                                }} 
                                onChange={(e) => {
                                const checked = e.target.value;
                                }} />
                        ]}
                    >
                        <Skeleton avatar title={false} loading={false} active >
                            <List.Item.Meta
                                avatar={
                                    <UserAvatar />
                                }
                                title={item.name}
                                description={
                                    item.distance !== undefined &&
                                    <>
                                        Khoảng cách : {item.distance.toFixed(0)}m
                                    </>
                                }
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
            </>}

            {searchType == 'users' && channelList.length > 0 && <>
                <h6>Kênh</h6>
                <List
                className="conversation-list"
                loading={loading}
                itemLayout="horizontal"
                dataSource={channelList}
                renderItem={(item, index) => (
                    <List.Item className='clickable'
                        onClick={() => {
                            onConversationSelect(item.id)
                        }}
                        actions={[
                            <Checkbox checked={selectedChannelIds && selectedChannelIds.indexOf(item.id)!==-1} 
                                />
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