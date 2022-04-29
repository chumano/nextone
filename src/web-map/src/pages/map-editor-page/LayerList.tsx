import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";
import ModalAddLayer from "./ModalAddLayer";
import { LayerStyle, useMapEditor } from "./useMapEditor";
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {DragOutlined} from '@ant-design/icons'
import classnames from "classnames";

const groupLayers = (layers: LayerStyle[]) => {
    const groups = []
    const groupBy = (layer: LayerStyle) => {
        return layer.layerGroup;
    }

    for (let i = 0; i < layers.length; i++) {
        const origLayer = layers[i];
        const previousLayer = layers[i - 1]
        const layer = {
            ...origLayer
        }

        if (previousLayer && groupBy(previousLayer) && groupBy(previousLayer) == groupBy(layer) ) {
            const lastGroup = groups[groups.length - 1]
            lastGroup.push(layer)
        } else {
            groups.push([layer])
        }
    }
    return groups
}



const LayerListContainer: React.FC = () => {
    const mapEditor = useMapEditor();

    const [listItems, setListItems] = useState<JSX.Element[]>();
    const [sortItemIds, setSortItemIds] = useState<string[]>([]);
    const [modalAddLayerVisible, setModalAddLayerVisible] = useState(false);
    const wrapSortItem= (ele : JSX.Element,  key:string , className:string) =>{
        return <SortableItem key={key} id={key} className={className} >
            {ele}
        </SortableItem>
    }

    const isCollapsed = useCallback((groupName:string, idx:number) => {
        const lookupKey = [groupName, idx].join('-')
        const collapsed = mapEditor.mapEditorState.collapsedGroups[lookupKey]
        return collapsed === undefined ? false : collapsed
    },[mapEditor.mapEditorState.collapsedGroups]);
    
    const toggleLayerGroup = (groupName:string, idx:number) => {
        const lookupKey = [groupName, idx].join('-')
        const newGroups = { ... mapEditor.mapEditorState.collapsedGroups }
        if(lookupKey in  mapEditor.mapEditorState.collapsedGroups) {
          newGroups[lookupKey] = ! mapEditor.mapEditorState.collapsedGroups[lookupKey]
        } else {
          newGroups[lookupKey] = true
        }
        mapEditor.setCollapsedGroups(newGroups)
    }
    
    useEffect(() => {
        console.log('mapEditor.mapEditorState', mapEditor.mapEditorState)
        let idx = 0;
        const items: JSX.Element[] = [];
        const itemIds:string[] = [];
        const groups = groupLayers(mapEditor.mapEditorState.layers);
        

        groups.forEach(g => {
            const firstLayerInGroup = g[0];
            const groupIdx = idx;
            if(firstLayerInGroup.layerGroup){
                const key = 'group-' + idx;
                items.push(
                    wrapSortItem(
                        <LayerListGroup key={key} 
                            collapsed={isCollapsed(firstLayerInGroup.layerGroup, groupIdx)}
                            onToggleCollapse={()=>{
                                toggleLayerGroup(firstLayerInGroup.layerGroup, groupIdx);
                            }}
                             name={firstLayerInGroup.layerGroup} />, 
                        key, '')
                )
                itemIds.push(key);
            }
            const gLayers = g;
            
            gLayers.forEach(l => {
                const key = 'item-' + idx;
                const isItemCollapsed = //gLayers.length > 1 && 
                    isCollapsed(l.layerGroup, groupIdx) && 
                    idx !== mapEditor.mapEditorState.selectedLayerIndex;
               
                items.push(
                    
                    wrapSortItem(
                        <LayerListItem key={key}
                            layerIndex={idx}
                            layerType={l.layerType}
                            name={l.name}
                            isSelected={idx == mapEditor.mapEditorState.selectedLayerIndex}
                            visibility={l.visibility}
                            className={classnames({
                                'layer-list-item--collapsed': isItemCollapsed
                            })}
                            onLayerAction={mapEditor.onLayerAction}
                        />, 
                        key, isItemCollapsed?'collapsed': '')
                )
                itemIds.push(key);

                idx++;
            })
        })
        setSortItemIds(itemIds);
        setListItems(items);
    }, [mapEditor.mapEditorState.layers,
        mapEditor.mapEditorState.collapsedGroups,
        mapEditor.mapEditorState.selectedLayerIndex])

    const onLayerAdded = useCallback((layerStyle: LayerStyle) => {
        mapEditor.addLayer(layerStyle);
    }, [])

    return <>
        <div className="layer-list">
            <div className="layer-list__header">
                <div>Layers</div>
                <div className="flex-spacer"></div>
                {/* <button
                    className="maputnik-button">
                    {"Expand"}
                </button> */}

                <button onClick={() => {
                    setModalAddLayerVisible(true);
                }}
                    className="maputnik-button">
                    Add Layer
                </button>
            </div>

            <div className="layer-list__container">
                 <SortableContext
                    items={sortItemIds}
                    strategy={verticalListSortingStrategy}
                    
                > 
                    {listItems}
                </SortableContext>
            </div>
        </div>

        {modalAddLayerVisible
            && <ModalAddLayer onLayerAdded={onLayerAdded}
                visible={modalAddLayerVisible}
                onToggle={(visible: boolean) => {
                    setModalAddLayerVisible(visible);
                }} />
        }
    </>
}
const SortableItem =(props: any) => {
    const type = props.id.indexOf('group') >= 0? 'group' : 'item';
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id , disabled: type=='group',data: {typeGroup: type} });

    const style : React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        flexDirection :'row'
    };

    return (
        <div ref={setNodeRef} style={style} className={classnames('wrap-layer-list-item', props.className)}>
            {type=='item' 
             &&  <div className="layer-item-draggle" {...attributes} {...listeners} >
                <DragOutlined />
            </div>
            }
            <div style={{flexGrow:1}}>
                {props.children}
            </div>
            
        </div>
    );
}

const SortableContainer : React.FC<any> = ({children, handleDragEnd}) => {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 10 pixels before activating
            activationConstraint: {
              distance: 10,
            },
            
        }),
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return <DndContext modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        {children}
    </DndContext>
}
const LayerListContainerSortable : React.FC<any> = (props)=>{
    const mapEditor = useMapEditor();
    const handleDragEnd = (event:DragEndEvent) => {
        const {active, over} = event;
        if(!over) return;
        console.log(`active.id  ${active.id} -> over.id ${over.id}`)
        if (active.id !== over.id) {
            const typeActive = active.id.indexOf('group') >= 0? 'group' : 'item';
            const typeOVer = over.id.indexOf('group') >= 0? 'group' : 'item';
            if(typeActive != 'item') return;
            const layers=  mapEditor.mapEditorState.layers;

            const activeIndex = active.id.split('-')[1];
            const overIndex = over.id.split('-')[1];
            const oldIndex = parseInt(activeIndex);
            const newIndex = parseInt(overIndex);

            let newGroup =  layers[newIndex].layerGroup;
            let isMove = true;
            if(typeOVer=='group'){
                const translated  = active.rect.current.translated || {top:0};
                const isUp = translated.top< over.rect.top? true: false;
                if(isUp){
                    if(newIndex>0){
                        const preIndex= newIndex-1;
                        if(preIndex == oldIndex){
                            newGroup = newGroup;
                            isMove = false;
                        }else{
                            newGroup = layers[preIndex].layerGroup;
                        }
                       
                    }else{
                        newGroup = ''
                    }
                }
            }
            
            //chang group
            layers[oldIndex] = { ... layers[oldIndex], layerGroup: newGroup}

            let sortedLayers = [...layers]; 
            if(isMove){
                 sortedLayers = arrayMove(layers, oldIndex, newIndex);
            }
            mapEditor.setLayers(sortedLayers);
        }
    }

    return <SortableContainer handleDragEnd={handleDragEnd}>
        <LayerListContainer {...props}></LayerListContainer>
    </SortableContainer>
}

const LayerList: React.FC = (props: any) => {
    return <LayerListContainerSortable
        {...props}
    />
}
export default LayerList;
