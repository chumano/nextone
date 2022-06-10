import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { mapApi } from "../../../apis/mapApi";
import { MapInfo } from "../../../models/map/Map.modal";
import '../../../styles/pages/admin-config/system-config.scss'
import ConfigEventTypes from "./ConfigEventTypes";
import ConfigMap from "./ConfigMap";

const ConfigPage: React.FC = () => {
   
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