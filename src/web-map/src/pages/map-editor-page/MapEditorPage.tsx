import { Button } from "antd";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import MapEditorLayout from "../../components/_layouts/MapEditorLayout";
import { MapState, useMapStore } from "../../stores";
import { useObservable } from "../../utils/hooks";
import LayerList from "./LayerList";
import ToolBar from "./ToolBar";

const toolbar = <ToolBar />
const layerList = <LayerList/>

const layerEditor = <>
        Layer editor
    </>
const bottomPanel = <>bottom panel</>
const modals = <>
</>

const MapEditorPage : React.FC = ()=>{
    const {mapState, ...mapStore} = useMapStore();
    let params = useParams();
    console.log('MapEditorPage-params' , params)
    const mapid = params['mapid'];

    const mapRenderer = useCallback(()=>{
        return <>Map {mapState.maps.length} : {mapid}</>
    },[mapState])

    return <>
        <MapEditorLayout 
            toolbar={toolbar}
            layerList={layerList}
            layerEditor={layerEditor}
            map={mapRenderer()}
            bottom={bottomPanel}
            modals={modals}
            onItemClick={()=>{}}
        />
    </>
   ;
}

export default MapEditorPage;