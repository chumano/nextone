import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mapApi } from "../../../apis/mapApi";
import NoPermission from "../../../components/auth/NoPermission";
import { MapInfo } from "../../../models/map/Map.modal";
import { IAppStore } from "../../../store";
import '../../../styles/pages/admin-config/system-config.scss'
import ConfigEventTypes from "./ConfigEventTypes";
import ConfigMap from "./ConfigMap";

const ConfigPage: React.FC = () => {
    const user = useSelector((store: IAppStore) => store.auth.user);
    const systemUserRole = user?.profile.role;
    if(systemUserRole !== 'admin'){
        return <NoPermission/>
    }

    return <>
        <div className="system-config">
            <div className="system-config__head">
                <span className="page-title">Cấu hình hệ thống</span>
            </div>

            <Tabs defaultActiveKey="map" tabPosition={'left'} style={{}}>
                <Tabs.TabPane tab={`Bản đồ`} key={'map'} >
                   <ConfigMap/>
                </Tabs.TabPane>
                <Tabs.TabPane tab={`Loại sự kiện`} key={'event-type'} >
                    <ConfigEventTypes/>
                </Tabs.TabPane>
            </Tabs>

        </div>

    </>;
}

export default ConfigPage;