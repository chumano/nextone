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
import { LayerStyle, useMapEditor } from "./useMapEditor";
import { SampleLayers } from "./layerData";
import { useDatasourceApi } from "../../apis";
import { useDatasourceStore } from "../../stores/useDataSourceStore";
import { geo2LayerType } from "../../utils/functions";


const bottomPanel = <>Map@2022</>
const modals = <>
</>

const MapEditorPage: React.FC = () => {
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
            map.Layers.forEach(l =>{
                const layerStyle : LayerStyle = {
                    name : l.LayerName,
                    layerGroup : l.LayerGroup,

                    sourceId : l.DataSourceId,
                    layerType : geo2LayerType(l.DataSourceGeoType),
                    visibility : l.Active,
                    minZoom : l.MinZoom,
                    maxZoom: l.MaxZoom,
                    note: l.Note,
                    style: l.PaintProperties
                };
                layers.push(layerStyle);
            })

            mapEditor.setMapInfo({
                id: map.Id??'',
                name: map.Name
            }, layers);
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

    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapEditor.mapEditorState.mapInfo} />}
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