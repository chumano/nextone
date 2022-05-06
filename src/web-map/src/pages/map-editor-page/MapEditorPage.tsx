import { Button, Modal as AntDModal } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapEditorLayout from "../../components/_layouts/MapEditorLayout";
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import LayerList from "./LayerList";
import ToolBar from "./ToolBar";
import '../../styles/pages/map-editor-page.scss';
import LayerEditor from "./LayerEditor";
import 'leaflet/dist/leaflet.css';
import MapView from "./MapView";
import { LayerStyle, useMapEditor } from "./useMapEditor";
import { SampleLayers } from "./layerData";
import { useDatasourceApi } from "../../apis";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { geo2LayerType } from "../../utils/functions";


const bottomPanel = <>Map@2022</>
const modals = <>
</>

const MapEditorPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { mapState, ...mapStore } = useMapStore();
    const sourceStore = useDatasourceStore();
    const mapEditor = useMapEditor();
    
    useEffect(()=>{
        sourceStore.list()
    },[])

    useEffect(() => {
        const mapid = params['mapid'] as string;
        if (!mapid) return;
        const fetchMapInfo = async () => {
            const map = await mapStore.get(mapid);
            
            const layers : LayerStyle[] =[];
            map.layers.forEach(l =>{
                const layerStyle : LayerStyle = {
                    name : l.layerName,
                    layerGroup : l.layerGroup,

                    sourceId : l.dataSourceId,
                    layerType : geo2LayerType(l.dataSourceGeoType),
                    visibility : l.active,
                    minZoom : l.minZoom,
                    maxZoom: l.maxZoom,
                    note: l.note,
                    style: l.paintProperties
                };
                layers.push(layerStyle);
            })

            mapEditor.setMapInfo({
                id: map.id??'',
                name: map.name
            }, layers);
        }

        fetchMapInfo()
            .catch(err => {
                AntDModal.error({
                    title: 'Có lỗi',
                    content: <>
                        {`Không thể lấy thông tin map ${mapid} `}
                    </>,
                    onOk(){
                        navigate("/maps");
                    }
                });
            })
    }, [params]);

    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapEditor.mapEditorState.mapInfo} />}
            layerList={<LayerList />}
            layerEditor={ mapEditor.mapEditorState.selectedLayerIndex!=undefined && <LayerEditor />}
            map={
                mapEditor.mapEditorState.mapInfo?.id ? 
                <MapView mapId={mapEditor.mapEditorState.mapInfo.id}/> 
                :null
                }
            bottom={bottomPanel}
            modals={modals}
            onItemClick={() => { }}
        />
    </>
}

export default MapEditorPage;