import { Button, Modal as AntDModal } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapEditorLayout from "../../components/_layouts/MapEditorLayout";
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore, useSymbolStore } from "../../stores";
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
import ModalSymbol from "./ModalSymbol";
import ModalMap from "./ModalMap";
import Loading from "../../components/common/Loading";


const bottomPanel = <>Map@2022</>


const MapEditorPage: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { mapState, ...mapStore } = useMapStore();
    const sourceStore = useDatasourceStore();
    const symbolStore = useSymbolStore();
    const mapEditor = useMapEditor();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        sourceStore.list();
        symbolStore.list();
    },[])

    useEffect(() => {
        const mapid = params['mapid'] as string;
        console.log("edit map", mapid);
        if (!mapid) return;
        const fetchMapInfo = async () => {
            const map = await mapStore.get(mapid);
            mapEditor.setMapInfo(map);
            setLoading(false);
        }
        setLoading(true);
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

    const modals = <>
        {mapEditor.mapEditorState.showModalSymbol &&
            <ModalSymbol />
        }
        {mapEditor.mapEditorState.showModalMap &&
            <ModalMap />
        }
    </>
    console.log('MapEditorPage render....')
    return <>
        <MapEditorLayout
            toolbar={<ToolBar map={mapEditor.mapEditorState.mapInfo} />}
            layerList={<LayerList />}
            layerEditor={ mapEditor.mapEditorState.selectedLayerIndex!=undefined && <LayerEditor />}
            map={
                <>
                {loading && <Loading/>}
                {!loading && mapEditor.mapEditorState.mapInfo?.id ? 
                    <MapView /> 
                    :null}
                    </>
                }
            bottom={bottomPanel}
            modals={modals}
            onItemClick={() => { }}
        />
    </>
}

export default MapEditorPage;