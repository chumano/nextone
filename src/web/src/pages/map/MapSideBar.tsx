import classNames from 'classnames'
import React, { useState } from 'react'
import { Button, Select, Tabs } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import { EventInfo } from '../../models/event/Event.model';
import EventList from './EventList';
import UserList from './UserList';

const MapSideBar : React.FC<{
    onDeleteEvent?: (item: EventInfo) =>void;
}>  = ({onDeleteEvent}) => {
    const [openSidebar, setOpenSidebar] = useState(false)
    return <div className={classNames({
        'map-sidebar map-overlay': true,
        'open': openSidebar
    })}>
        <div className='map-overlay__content'>
            <div className='map-sidebar__header'>
                {!openSidebar &&
                    <h6>Sự kiện/ Người dùng</h6>
                }
                <div className='flex-spacer'></div>
                {openSidebar &&
                    <Button type="default" shape="circle" icon={<CloseOutlined />}
                        onClick={() => {
                            setOpenSidebar((state) => !state)
                        }} />
                }

                {!openSidebar &&
                    <Button type="default" shape="circle" icon={<DownOutlined />}
                        onClick={() => {
                            setOpenSidebar((state) => !state)
                        }} />
                }
            </div>

            {openSidebar && <>
                <div className='map-sidebar__body'>
                    <Tabs defaultActiveKey="events" >
                        <Tabs.TabPane tab="Sự kiện" key="events">
                            <EventList onDeleteEvent={onDeleteEvent} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Người dùng" key="users">
                            <UserList />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </>}
        </div>
    </div>
}

export default MapSideBar