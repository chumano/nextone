import { Tag } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Channel } from '../../models/channel/Channel.model'
import { Conversation } from '../../models/conversation/Conversation.model'
import { ConversationType } from '../../models/conversation/ConversationType.model'
import { MessageType } from '../../models/message/MessageType.model'
import { UserStatus } from '../../models/user/UserStatus.model'
import { IAppStore } from '../../store'
import { chatActions } from '../../store/chat/chatReducer'
import { compareDate } from '../../utils/functions'
import ConversationAvatar from './ConversationAvatar'
import UserAvatar from './UserAvatar'

interface ConversationItemProps {
    conversation: Conversation
}
const ConversationItem: React.FC<ConversationItemProps> =
    ({ conversation }) => {
        const user = useSelector((store: IAppStore) => store.auth.user);
        const selectedConversationId = useSelector((store: IAppStore) => store.chat.selectedConversationId);
        const dispatch = useDispatch();

        const userId = user!.profile.sub;

        const [name, setName] = useState<string>();
        const [otherUser, setOtherUser] = useState<UserStatus>();
        const userConversationMember = conversation.members.find(o => o.userMember.userId ===userId);
        const [haveNewMessage,setHaveNewMessaage] = useState(false);
        const lastMessage = conversation.messages.length > 0? conversation.messages[0] : undefined;
        const seenDate = userConversationMember?.seenDate;

        useEffect(() => {
            let name = conversation.name;
            if (conversation.type == ConversationType.Peer2Peer) {
                const otherUsers = conversation.members.filter(o => o.userMember.userId != user!.profile.sub)
                const otherUser = otherUsers[0].userMember;
                name = otherUser.userName;
                setOtherUser(otherUser);
            }

            setName(name);
        }, [conversation])

        useEffect(()=>{
            if(!lastMessage || lastMessage.userSender.userId=== userId){
                setHaveNewMessaage(false)
                return;
            }

            if(!seenDate){
                setHaveNewMessaage(true)
                return;
            }
            const lastMessageDate = lastMessage?.sentDate;

            //seenDate < lastMessageDate
            if(compareDate(seenDate, lastMessageDate)===-1){
                setHaveNewMessaage(true)
                return;
            }
                
            setHaveNewMessaage(false)
        }, [lastMessage, seenDate, userId])

        const MAX_LENGTH = 30;
        const displayName = name &&name.length >= MAX_LENGTH?  name.substring(0,MAX_LENGTH-3)+'...' : name;
        
        const isConversationHaveMessage = conversation && conversation.messages 
                && conversation.messages.length > 0;

        const renderLastMessageText = () => {
            let lastMessageText = '';
            if (isConversationHaveMessage) {
              const lastMessage = conversation.messages[0];
              const {isDeleted} = lastMessage;
              if(isDeleted) return 'Tin nhắn đã bị xóa';
              
              if (conversation.type !== ConversationType.Peer2Peer) {
                lastMessageText += lastMessage.userSender.userName + ': ';
              }
              if (lastMessage.type === MessageType.Text || lastMessage.type === MessageType.CallMessage || lastMessage.type === MessageType.CallEndMessage) {
                let content = lastMessage.content.replace(/[\r\n]+/g, ' ');
                if (content.length > 20) {
                  content = content.slice(0, 20).trim() + '...';
                }
                lastMessageText += content;
              } else if (lastMessage.type === MessageType.ImageFile) {
                lastMessageText += 'Hình ảnh';
              } else if (lastMessage.type === MessageType.OtherFile) {
                lastMessageText += 'Tệp tin';
              } else if (lastMessage.type === MessageType.AudioFile) {
                lastMessageText += 'Ghi âm';
              }else if (lastMessage.type === MessageType.Event) {
                lastMessageText += 'Sự kiện';
              }
            }
            return lastMessageText;
          };

        return (
            <div className={classNames({
                'conversation-item clickable': true,
                'active': conversation.id === selectedConversationId
            })}
                onClick={() => {
                    dispatch(chatActions.selectConversation(conversation.id))
                }}>
                    
                {conversation.type === ConversationType.Peer2Peer &&
                    <UserAvatar user={otherUser} />
                }
                {conversation.type !== ConversationType.Peer2Peer &&
                    <ConversationAvatar />
                }

                <div>
                    <div className='conversation-name' title={name}>
                        {displayName}

                        {conversation.type === ConversationType.Channel && 
                            <>
                            {(conversation as Channel).allowedEventTypes.length >0 &&
                            <div style={{fontSize:10}}>
                                {(conversation as Channel).allowedEventTypes[0].name}
                            </div>
                            }
                            {(conversation as Channel).ancestors &&
                                <div>
                                    {(conversation as Channel).ancestors!.map(o=>(
                                        <Tag key={o.id}>{o.name}</Tag>
                                    ))}
                                </div>
                            }
                            </>
                        }
                    </div>
                    <div className='conversation-last-message'>
                        {renderLastMessageText()}
                    </div>
                </div>
              
                <div className='flex-spacer'></div>
                {haveNewMessage &&
                    <Tag color='green'>Mới</Tag>
                }
            </div>
        )
    }

export default ConversationItem