import { BehaviorSubject } from "rxjs";
import { useMapApi } from "../../apis";
import { LayerType, MapInfo, MapLayer, PaintPropertyKey } from "../../interfaces";
import { findLastIndex, layerType2Geo } from "../../utils/functions";
import { useObservable } from "../../utils/hooks";

export interface LayerStyle {
    name: string;
    layerGroup: string;
    layerType: LayerType;
    sourceId: string;

    visibility?: boolean;
    isSelected?: boolean;

    minZoom?: number;
    maxZoom?:number;
    note?: string;

    style?:{
        [key: PaintPropertyKey] : any
    }
}

export interface MapInfoState{
    id: string;
     name: string;
}

interface MapEditorState {
    mapInfo?: MapInfoState;
    layers: LayerStyle[];
    selectedLayerIndex?: number;
    collapsedGroups: {[key:string]: boolean};
}
const initialState = {
    layers: [],
    collapsedGroups: {}
};

const subject = new BehaviorSubject<MapEditorState>(initialState);

const setMapInfo = (mapInfo:{id:string, name: string} ,layers: LayerStyle[])=>{
    setNextState({ 
        mapInfo: {...mapInfo},
        layers: [...layers] 
    });
}
const setLayers = (layers: LayerStyle[]) => {
    setNextState({ layers: [...layers] });
}

const setCollapsedGroups = (collapsedGroups:  {[key:string]: boolean}) => {
    setNextState({ collapsedGroups: {...collapsedGroups} });
}

const onLayerAction = (layerIndex: number, action: string) => {
    //action : select | delete | visibility
    let { layers , selectedLayerIndex} = subject.getValue();
    switch (action) {
        case 'select':
            setNextState({ selectedLayerIndex: layerIndex });
            break;

        case 'visibility':
            layers = layers.map((item, index) => {
                if (index === layerIndex) {
                    return { ...item, ...{ visibility: !item.visibility } };
                }

                return item;
            });
            setNextState({ layers: layers });
            break;

        case 'delete':
            layers = layers.filter((item, index) => layerIndex != index);
            if(selectedLayerIndex == layerIndex){
                const selectedIndex = layerIndex > 0?  layerIndex -1
                                    : (layers.length >0 ? layerIndex : undefined); 
                setNextState({ layers: layers, selectedLayerIndex: selectedIndex });
            }else{
                setNextState({ layers: layers});
            }
            break;
    }
};


const onLayerPropertyChange = (layerIndex: number, property: string, newValue: any ) =>{
    let { layers} = subject.getValue();
    const layer = layers[layerIndex];
    const newLayer = {
        ...layer,
          [property]: newValue
    }
    layers[layerIndex] = newLayer;
    setNextState({ layers: [...layers] });
} 

const addLayer = (layer: LayerStyle) => {
    let { layers } = subject.getValue();
    //find lastLayer has same group
    const foundIndex = findLastIndex(layers, (l, index, layers) => {
        return l.layerGroup == layer.layerGroup;
    });
    let layerIndex = layers.length;
    if (foundIndex >= 0) {
        layers.splice(foundIndex + 1, 0, layer);
        layerIndex = foundIndex + 1;
        layers = [...layers]
    } else {
        layers = [...layers, layer];
    }
    setNextState({ layers: layers, selectedLayerIndex: layerIndex });
}

const setNextState = (payload: any) => {
    const state = subject.getValue();
    subject.next({ ...state, ...payload });
};

const getObservable = () => {
    return subject;
};


export const useMapEditor = () => {
    const api = useMapApi();
    const saveMap = async ()=>{
        let { mapInfo, layers } = subject.getValue();
        if(!mapInfo) return;

        const id = mapInfo.id;
        const mapLayers : MapLayer[] = layers.map(o=>{
            return {
                LayerName : o.name,
                LayerGroup : o.layerGroup,
                PaintProperties : o.style,
                DataSourceId : o.sourceId || '',
                MinZoom : o.minZoom,
                MaxZoom: o.maxZoom,
                Active: o.visibility,
                Note : o.note
            }
        });
        const mapUpdate :MapInfo =  {
            Name : mapInfo.name,
            Layers : mapLayers
        }
        await api.update(id, mapUpdate);
    }

    const observable = getObservable();
    const mapEditorState = useObservable<MapEditorState>(observable);
    return {
        mapEditorState,
        setMapInfo,
        setLayers,
        setCollapsedGroups,
        addLayer,

        onLayerPropertyChange,
        onLayerAction,
        
        saveMap,
        
        getObservable,
    };
}