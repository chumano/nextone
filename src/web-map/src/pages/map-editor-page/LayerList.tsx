import { DndContext } from "@dnd-kit/core";
import { Button } from "antd";
import React from "react"
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import { useObservable } from "../../utils/hooks";


const LayerListContainer : React.FC = ()=>{
    const mapStore = useMapStore();
    const mapObservable = mapStore.getMapObservable();
    const mapState = useObservable<MapState>(mapObservable);

    return <>
        LayerListContainer
        <b/>
        mapState.maps.length: {mapState.maps.length}
        <Button type="primary" onClick={()=>{
            const map :MapInfo = {
                Id: 'id-'+ (new Date()).toString(),
                Name : "New Map",
                Layers : []
            }
            mapStore.create(map)
        }}> add Map</Button>
    </>
}

const SortableContainer = (Component: React.FC<any>)=>{
   return (props:any)=>{
       return <DndContext>
           <Component {...props} />
       </DndContext>
   };
}
const LayerListContainerSortable = SortableContainer((props:any) => <LayerListContainer {...props} />)

const LayerList : React.FC = (props:any)=>{
    return <LayerListContainerSortable
        {...props}
        helperClass='sortableHelper'
        useDragHandle={true}
    />
}

export default LayerList;
