import { BehaviorSubject } from "rxjs";
import { LayerType } from "../../interfaces";
import { findLastIndex } from "../../utils/functions";
import { useObservable } from "../../utils/hooks";

export interface LayerStyle {
    name: string;
    layerGroup: string;

    layerType: LayerType;
    visibility?: boolean;

    isSelected?: boolean;
}

interface MapEditorState {
    layers: LayerStyle[];
    selectedLayerIndex?: number;
}
const initialState = {
    layers: [],
};

const subject = new BehaviorSubject<MapEditorState>(initialState);

const setLayers = (layers: LayerStyle[]) => {
    setNextState({ layers: [...layers] });
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
            onLayersChange(layers);
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

const onLayersChange = (layers: LayerStyle[]) => {
    setNextState({ layers: layers });
}

const setNextState = (payload: any) => {
    const state = subject.getValue();
    subject.next({ ...state, ...payload });
};

const getObservable = () => {
    return subject;
};


export const useMapEditor = () => {
    const observable = getObservable();
    const mapEditorState = useObservable<MapEditorState>(observable);
    return {
        mapEditorState,
        setLayers,
        addLayer,
        onLayerAction,
        getObservable,
    };
}