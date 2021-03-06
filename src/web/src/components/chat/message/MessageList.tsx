import { debounce } from 'lodash'
import { Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../../../models/message/Message.model'
import { IAppStore } from '../../../store'
import { ConversationState } from '../../../store/chat/ChatState'
import { getMessageHistory } from '../../../store/chat/chatThunks'
import Loading from '../../controls/loading/Loading'
import MessageItem from './MessageItem'

interface MessageListProps {
    conversation: ConversationState
}
const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
    const dispatch = useDispatch();
    const {messages, messagesLoading, messagesLoadMoreEmtpy} = conversation;
    const listRef = useRef<HTMLDivElement>(null);
    const [needLoadMore, setNeedLoadMore] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!listRef.current) {
            return;
        }
        const handleScroll = () => {
            const divHeight =listRef.current!.clientHeight;
            const scrollHeight =listRef.current!.scrollHeight;
            const currentScrollY =  listRef.current!.scrollTop ;
            const delta = 10;
            if (scrollHeight - divHeight+ currentScrollY < delta) {
                !needLoadMore && setNeedLoadMore(true);
            }else{
                needLoadMore && setNeedLoadMore(false);
            }

            //console.log({goToTop, currentScrollY, divHeight, scrollHeight});
        };

        listRef.current.addEventListener("scroll",  debounce(handleScroll,500));

        return () => listRef.current?.removeEventListener("scroll", handleScroll);
    }, [needLoadMore, setNeedLoadMore, listRef]);

    useEffect(()=>{
        if(!needLoadMore) return;
        //load old message
        if(messages.length==0) return;
        if(loading || messagesLoadMoreEmtpy) return;

        console.log('getMessageHistory...')
        const oldestMessage = messages[messages.length-1];
        setLoading(true);
        setNeedLoadMore(false);
        dispatch(getMessageHistory({
            conversationId: oldestMessage.conversationId,
            beforeDate: oldestMessage.sentDate,
            offset:0,
            pageSize:20
        }))

    },[needLoadMore, messages, loading, messagesLoadMoreEmtpy])

    useEffect(()=>{
        setLoading(messagesLoading||false);
    },[messagesLoading])

    return <>
        <div className='message-list' ref={listRef}>
            <Image.PreviewGroup>
                {messages.map(o =>
                    <MessageItem key={o.id} message={o} />
                )}
             </Image.PreviewGroup>
            {loading &&
                <Loading/>
            }
            
        </div>
    </>
}

export default MessageList
