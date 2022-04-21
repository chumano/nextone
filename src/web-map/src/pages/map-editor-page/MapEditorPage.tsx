import { Button } from "antd";
import React, { useCallback } from "react";
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
    const mapStore = useMapStore();
    const mapObservable = mapStore.getMapObservable();
    const mapState = useObservable<MapState>(mapObservable);
    
    const mapRenderer = useCallback(()=>{
        return <>Map {mapState.maps.length}</>
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