import React, { useMemo } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import { Message } from '../../types/Message/Message.type'
import { groupFileByType } from '../../utils/file.utils'
import FileView from '../File/FileView'

interface MessageEventProps {
    message: Message
}
const MessageEvent : React.FC<MessageEventProps> = ({message}) => {
    const eventInfo = message.event!;
    console.log("eventInfo", eventInfo);
    const group = useMemo(() => {
        return groupFileByType(eventInfo?.files || []);
    }, [eventInfo])

    const displayDate = message.sentDate;//frowNow(message.sentDate);
    return (
        <View >
            <View>
                <Text style={{ marginLeft: 10 }}>{eventInfo.eventType.name}</Text>
            </View>
            <View>
                <Text>
                    {eventInfo.content}
                </Text>
            </View>

            <View>
                <Text >{message.userSender.userName} </Text>
                <Text>{' - '}</Text>
                <Text >{eventInfo.occurDate}</Text>
            </View>

            {eventInfo.files && eventInfo.files.length > 0 &&
                <View >
                    {group['image'].length > 0 &&
                        
                        <View>
                            {group['image'].map(o =>
                                <View key={'image'+o.fileId} >
                                    <FileView  file={o} />
                                </View>
                            )}
                        </View>
                    }
                    {group['other'].length > 0 &&
                        <View >
                            {group['other'].map(o =>
                                <View key={'image'+o.fileId} >
                                    <FileView key={'file'+o.fileId} file={o} hiddenName={true} />
                                    <Text >
                                        {o.fileName}
                                    </Text>
                                </View>
                            )}
                        </View>
                    }
                </View>
            }
            
            <View >
                <Text>{displayDate}</Text>    
            </View>
        </View>
    )
}

export default React.memo(MessageEvent)