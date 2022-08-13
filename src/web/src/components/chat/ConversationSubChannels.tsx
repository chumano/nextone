import React from 'react'
import { SubChannel } from '../../models/channel/Channel.model'

interface ConversationSubChannelsProps{
    subchannels : SubChannel[]
}
const ConversationSubChannels : React.FC<ConversationSubChannelsProps> = ({subchannels}) => {
  return (
    <div>
        <div>
            Kênh con:
        </div>
        {subchannels.map(o=>(
            <div>
                {o.name} - {o.channelLevel}
            </div>
        ))}
    </div>
  )
}

export default ConversationSubChannels