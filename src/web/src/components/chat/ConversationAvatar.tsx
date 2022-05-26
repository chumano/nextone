import { Avatar, Badge } from 'antd'
import { CalendarOutlined} from '@ant-design/icons';
import React from 'react'
import { ConversationState } from '../../store/chat/ChatState'

interface ConversationAvatarProps{
    conversation?: ConversationState
}
const ConversationAvatar: React.FC<ConversationAvatarProps> = ({conversation}) => {
    return (
        <Avatar>
            <CalendarOutlined  style={{ color: 'black', fontSize: '20px' }} />
        </Avatar>
    )
}

export default ConversationAvatar