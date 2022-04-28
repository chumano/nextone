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
import { useMapEditor } from "./useMapEditor";
import { SampleLayers } from "./layerData";
import { useDatasourceApi } from "../../apis";
import { useDatasourceStore } from "../../stores/useDataSourceStore";


const bottomPanel = <>Map@2022</>
const modals = <>
</>

const MapEditorPage: React.FC = () => {
    const params = useParams();
    const { mapState, ...mapStore } = useMapStore();
    const sourceStore = useDatasourceStore();
    const mapEditor = useMapEditor();
    
    const [mapInfo, setMapInfo] = useState<MapInfo>();

    useEffect(()=>{
        sourceStore.list()
    },[])

    useEffect(() => {
        const mapid = params['mapid'] as string;
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
    }, [params]);

    
    useEffect(()=>{
        var index = 0;
        const layers : any[] =[];
        SampleLayers.forEach(l =>{
            layers.push({...l, layerIndex: index});
            index++;
        })
        mapEditor.setLayers(layers);
    },[])
    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapInfo} />}
            layerList={<LayerList />}
            layerEditor={ mapEditor.mapEditorState.selectedLayerIndex!=undefined && <LayerEditor />}
            map={<MapView />}
            bottom={bottomPanel}
            modals={modals}
            onItemClick={() => { }}
        />
    </>
}

export default MapEditorPage;