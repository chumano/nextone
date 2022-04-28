import { DndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { SampleLayers } from "./layerData";
import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";
import ModalAddLayer from "./ModalAddLayer";
import { LayerStyle, useMapEditor } from "./useMapEditor";
import {CSS} from '@dnd-kit/utilities';

const groupLayers = (layers: LayerStyle[])=>{
    const groups = []
    const groupBy = (layer:LayerStyle)=>{
        return layer.layerGroup;
    }

    for (let i = 0; i <layers.length; i++) {
      const origLayer = layers[i];
      const previousLayer = layers[i-1]
      const layer = {
        ...origLayer
      }

      if(previousLayer && groupBy(previousLayer) == groupBy(layer)) {
        const lastGroup = groups[groups.length - 1]
        lastGroup.push(layer)
      } else {
        groups.push([layer])
      }
    }
    return groups
}

function SortableItem(props:any) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({id: props.id});
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.children}
      </div>
    );
}

const LayerListContainer: React.FC = () => {
    const mapEditor = useMapEditor();
    
    const [listItems,setListItems] = useState<JSX.Element[]>();
    const [modalAddLayerVisible, setModalAddLayerVisible] = useState(false);

    useEffect(()=>{
        console.log('mapEditor.mapEditorState.layers', mapEditor.mapEditorState.layers)
        let idx = 0;
        const items : JSX.Element[]= [];
        const groups = groupLayers(mapEditor.mapEditorState.layers);
        groups.forEach(g =>{
            const firstLayerInGroup = g[0];
            let key = 'group-'+ idx;
            items.push(
                <LayerListGroup key={key} name={firstLayerInGroup.layerGroup} />
            )
            const gLayers = g;
            gLayers.forEach(l =>{
                let key = 'item-'+ idx;;
                items.push(
                    <LayerListItem key={key} 
                        layerIndex={idx} 
                        layerType={l.layerType}
                        name={l.name}
                        isSelected={idx == mapEditor.mapEditorState.selectedLayerIndex} 
                        visibility={l.visibility}
                        onLayerAction={mapEditor.onLayerAction}
                        />
                )
                idx++;
            })
        })

        setListItems(items);
    },[mapEditor.mapEditorState.layers, mapEditor.mapEditorState.selectedLayerIndex])
    
    const onLayerAdded = useCallback((layerStyle: LayerStyle)=>{
        mapEditor.addLayer(layerStyle);
    },[])

    return <>
        <div className="layer-list">
            <div className="layer-list__header">
                <div>Layers</div>
                <div className="flex-spacer"></div>
                <button
                    className="maputnik-button">
                    {"Expand"}
                </button>

                <button onClick={()=>{
                    setModalAddLayerVisible(true);
                }}
                    className="maputnik-button">
                    Add Layer
                </button>
            </div>

            <div className="layer-list__container">
                {listItems}
            </div>
        </div>

        {modalAddLayerVisible 
        && <ModalAddLayer onLayerAdded={onLayerAdded}
                visible={modalAddLayerVisible} 
                onToggle={(visible:boolean)=>{
                    setModalAddLayerVisible(visible);
                }}/>
        }
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
