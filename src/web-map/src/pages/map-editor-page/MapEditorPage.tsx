import { Button, Modal as AntDModal } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MapEditorLayout from "../../components/_layouts/MapEditorLayout";
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import LayerList from "./LayerList";
import ToolBar from "./ToolBar";
import '../../styles/pages/map-editor-page.scss';
import LayerEditor from "./LayerEditor";
import 'leaflet/dist/leaflet.css';
import MapView from "./MapView";
import { layerGroups } from "./layerData";
import { useMapEditor } from "./useMapEditor";


const bottomPanel = <>Map@2022</>
const modals = <>
</>

const MapEditorPage: React.FC = () => {
    const { mapState, ...mapStore } = useMapStore();
    const mapEditor = useMapEditor();
    
    const [mapInfo, setMapInfo] = useState<MapInfo>();
    let params = useParams();
    const mapid = params['mapid'] as string;

    useEffect(() => {
        if (!mapid) return;
        const fetchMapInfo = async () => {
            const map = await mapStore.get(mapid);
            setMapInfo(map);
        }

        fetchMapInfo()
            .catch(err => {
                AntDModal.error({
                    title: 'Có lỗi',
                    content: <>
                        {`Không thể lấy thông tin map ${mapid} `}
                    </>,
                });
            })
    }, [mapid]);

    useEffect(()=>{
        var index = 0;
        const layers : any[] =[];
        layerGroups.forEach(g =>{
            g.layers.forEach(l =>{
                layers.push({...l});
                index++;
            })
           
        })
        mapEditor.setLayers(layers);
    },[])
    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapInfo} />}
            layerList={<LayerList />}
            layerEditor={<LayerEditor />}
            map={<MapView />}
            bottom={bottomPanel}
            modals={modals}
            onItemClick={() => { }}
        />
    </>
}

export default MapEditorPage;