import { DndContext } from "@dnd-kit/core";
import { Button } from "antd";
import React, { useEffect, useMemo, useState } from "react"
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import { layerGroups } from "./layerData";
import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";
import { useMapEditor } from "./useMapEditor";

const LayerListContainer: React.FC = () => {
    const mapEditor = useMapEditor();
    const [listItems,setListItems] = useState<JSX.Element[]>();
   
    useEffect(()=>{
        console.log('mapEditor.mapEditorState.layers', mapEditor.mapEditorState.layers)
        if(mapEditor.mapEditorState.layers.length==0) return;
        var index = 0;
        const items : JSX.Element[]= [];
        layerGroups.forEach(g =>{
            let key = 'group-'+ index.toString();
            items.push(
                <LayerListGroup key={key} {...g}/>
            )
            g.layers.forEach(l =>{
                let key = 'item-'+ index.toString();
                const layerProps = mapEditor.mapEditorState.layers[index];
                items.push(
                    <LayerListItem key={key} 
                        layerIndex={index} 
                        layerType={layerProps.layerType}
                        name={layerProps.name}
                        isSelected={layerProps.name=='sông'} 
                        visibility={layerProps.visibility}
                        />
                )
                index++;
            })
           
        })

        setListItems(items);
    },[mapEditor.mapEditorState.layers])
    

    return <>
        <div className="layer-list">
            <div className="layer-list__header">
                <div>Layers</div>
                <div className="flex-spacer"></div>
                <button
                    className="maputnik-button">
                    {"Expand"}
                </button>

                <button
                    className="maputnik-button ">
                    Add Layer
                </button>
            </div>

            <div className="layer-list__container">
                {listItems}
            </div>
        </div>
    </>
}

const SortableContainer = (Component: React.FC<any>) => {
    return (props: any) => {
        return <DndContext>
            <Component {...props} />
        </DndContext>
    };
}
const LayerListContainerSortable = SortableContainer(LayerListContainer)

const LayerList: React.FC = (props: any) => {
    return <LayerListContainerSortable
        {...props}
        helperClass='sortableHelper'
        useDragHandle={true}
    />
}
export default LayerList;
