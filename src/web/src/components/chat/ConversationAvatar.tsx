import { Avatar, Badge, Icon } from 'antd'
import React from 'react'
import { ConversationState } from '../../store/chat/ChatState'

interface ConversationAvatarProps{
    conversation?: ConversationState
}
const ConversationAvatar: React.FC<ConversationAvatarProps> = ({conversation}) => {
    return (
        <Avatar>
            <Icon type="calendar" style={{ color: 'black', fontSize: '20px' }} />
        </Avatar>
    )
}

export default ConversationAvatar