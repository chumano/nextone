
import {
    ChatItem, MessageBox, MeetingMessage, MessageList,
    ChatList, Input, Popup, Dropdown,
    Avatar, MeetingItem, MeetingList
} from 'react-chat-elements';
import { chatList } from '../chat/fakedate';

interface ChannelMemmbersProp{
    onItemClick : (item:any) => void
}

const ChannelMemmbers: React.FC<ChannelMemmbersProp> = ({onItemClick}) => {
    const itemClick = (item:any)=>{
        console.log("itemClick", item);
        onItemClick(item);
    }
    return <>
        <div className="channel-members">
            <div className="channel-members__header">
                <h5>Người dùng</h5>
                <div className="search-container">
                    <input type="search" className="form-control" ></input>
                </div>

            </div>
            <ChatList className='member-list'
                onClick={itemClick}
                dataSource={chatList} />
        </div>

    </>
}

export default ChannelMemmbers;