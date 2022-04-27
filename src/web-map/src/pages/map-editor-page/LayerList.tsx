import { DndContext } from "@dnd-kit/core";
import { Button } from "antd";
import React, { useEffect, useState } from "react"
import { MapInfo } from "../../interfaces";
import { MapState, useMapStore } from "../../stores";
import { useObservable } from "../../utils/hooks";
import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";

const LayerListContainer: React.FC = () => {
    const { mapState, ...mapStore } = useMapStore();
    

    
    const [listItems,setListItems] = useState<JSX.Element[]>();
    useEffect(()=>{
        var index = 0;
        const items : JSX.Element[]= [];
        layerGroups.forEach(g =>{
            let key = index++;
            items.push(
                <LayerListGroup key={'group-'+key.toString()} {...g}/>
            )
            g.layers.forEach(l =>{
                let key = index++;
                items.push(
                    <LayerListItem key={'item-'+key.toString()}  isSelected={l.name=='sông'} {...l}/>
                )
            })
        })

        setListItems(items);
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
const LayerListContainerSortable = SortableContainer((props: any) => <LayerListContainer {...props} />)

const LayerList: React.FC = (props: any) => {
    return <LayerListContainerSortable
        {...props}
        helperClass='sortableHelper'
        useDragHandle={true}
    />
}

export default LayerList;

const layerGroups = [
    {
        name : 'basemap',
        layers: [
            {
                name: 'basemap 1',
                layerType: 'fill'
            },
            {
                name: 'basemap 2',
                layerType: 'fill'
            }
        ]
    },
    {
        name : 'hạ tầng',
        layers: [
            {
                name: 'đường quốc lộ',
                layerType: 'line'
            },
            {
                name: 'đường nội tỉnh',
                layerType: 'circle'
            },
            {
                name: 'đường nội tỉnh',
                layerType: ''
            },
        ]
    },
    {
        name : 'thủy hệ',
        layers: [
            {
                name: 'sông',
                layerType: 'line'
            },
            {
                name: 'suối',
                layerType: 'circle'
            },
            {
                name: 'kênh/ rạch',
                layerType: ''
            },
        ]
    },
    {
        name : 'thực vật',
        layers: [
            {
                name: 'cây lâu năm',
                layerType: 'line'
            },
            {
                name: 'cây công viên',
                layerType: 'circle'
            },
            {
                name: 'cây ven đường',
                layerType: ''
            },
        ]
    },
    {
        name : 'nhà ở',
        layers: [
            {
                name: 'chưng cư',
                layerType: 'line'
            },
            {
                name: 'nhà dân',
                layerType: 'circle'
            },
            {
                name: 'cơ quan',
                layerType: ''
            },
        ]
    },
    {
        name : 'điểm du lịch',
        layers: [
            {
                name: 'cấp 1',
                layerType: 'line'
            },
            {
                name: 'cấp 2',
                layerType: 'circle'
            },
            {
                name: 'cấp 3',
                layerType: ''
            },
        ]
    },
    {
        name : 'điểm khác',
        layers: [
            {
                name: 'điểm khác 1',
                layerType: 'line'
            },
            {
                name: 'điểm khác 2',
                layerType: 'circle'
            },
            {
                name: 'điểm khác 3',
                layerType: ''
            },
            {
                name: 'điểm khác 4',
                layerType: ''
            },
        ]
    }
]
