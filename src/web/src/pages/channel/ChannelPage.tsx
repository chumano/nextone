import { useState } from 'react';
import '../../styles/pages/channel/channel-page.scss';
import ChannelEvents from './ChannelEvents';
import ChannelMap from './ChannelMap';
import ChannelMemmbers from './ChannelMembers';
import ChatModal from './ChatModal';

const ChannelPage: React.FC = (): JSX.Element => {
    const [isShowModal, setIsShowModal] = useState(false);
    const onMemberItemClick = ()=>{
        setIsShowModal(true);
    }
    
    return <>
        <div className="channel-page">
            <div className="channel-page__header">
                <span className="page-title">Giám sát kênh</span>
            </div>
            <div className="channel-page__body">
                <div className="channel-sidebar">
                    <ChannelMemmbers onItemClick={onMemberItemClick}></ChannelMemmbers>
                </div>  
                <div className="channel-main">
                    <div className="map-container">
                        <ChannelMap></ChannelMap>
                    </div>
                </div>
                <div className="channel-sidebar-right">
                    <ChannelEvents></ChannelEvents>
                </div>
            </div>
        </div>
        
        <ChatModal isShow={isShowModal} ></ChatModal>
    </>;
}

export default ChannelPage;