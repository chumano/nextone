import { debounce } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Message } from '../../models/message/Message.model'
import { IAppStore } from '../../store'
import { getMessageHistory } from '../../store/chat/chatReducer'
import { ConversationState } from '../../store/chat/ChatState'
import Loading from '../controls/loading/Loading'
import MessageItem from './message/MessageItem'

interface MessageListProps {
    conversation: ConversationState
}
const MessageList: React.FC<MessageListProps> = ({ conversation }) => {
    const dispatch = useDispatch();
    const {messages, messagesLoading, messagesLoadMoreEmtpy} = conversation
    const listRef = useRef<HTMLDivElement>(null);
    const [goToTop, setGoToTop] = useState(false);
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
                !goToTop && setGoToTop(true);
            }else{
                goToTop && setGoToTop(false);
            }

            //console.log({goToTop, currentScrollY, divHeight, scrollHeight});
        };

        listRef.current.addEventListener("scroll",  debounce(handleScroll,500));

        return () => listRef.current?.removeEventListener("scroll", handleScroll);
    }, [goToTop, setGoToTop, listRef]);

    useEffect(()=>{
        if(!goToTop) return;
        //load old message
        if(messages.length==0) return;
        if(loading || messagesLoadMoreEmtpy) return;
        console.log('getMessageHistory...')
        const oldestMessage = messages[messages.length-1];
        setLoading(true);
        dispatch(getMessageHistory({
            conversationId: oldestMessage.conversationId,
            beforeDate: oldestMessage.sentDate,
            offset:0,
            pageSize:20
        }))

    },[goToTop, messages, loading, messagesLoadMoreEmtpy])

    useEffect(()=>{
        setLoading(messagesLoading||false);
    },[messagesLoading])

    return <>
        <div className='message-list' ref={listRef}>
            {loading &&
                <Loading/>
            }
            {messages.map(o =>
                <MessageItem key={o.id} message={o} />
            )}
        </div>
    </>
}

export default MessageList
