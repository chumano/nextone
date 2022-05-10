import { BehaviorSubject } from "rxjs";
import { useMapApi } from "../../apis";
import { LayerType, MapBoudingBox, MapInfo, MapLayer, PaintPropertyKey } from "../../interfaces";
import { findLastIndex, geo2LayerType, handleAxiosApi, layerType2Geo } from "../../utils/functions";
import { useObservable } from "../../utils/hooks";

export interface LayerStyle {
    name: string;
    layerGroup: string;
    layerType: LayerType;
    sourceId: string;

    visibility?: boolean;
    isSelected?: boolean;

    minZoom?: number;
    maxZoom?: number;
    note?: string;

    style?: {
        [key: PaintPropertyKey]: any
    }
}

export interface MapInfoState {
    id: string;
    name: string;
    version: number;
    boundingBox?: MapBoudingBox
}

interface MapEditorState {
    mapInfo?: MapInfoState;
    layers: LayerStyle[];
    selectedLayerIndex?: number;
    collapsedGroups: { [key: string]: boolean };

    showModalSymbol?: boolean,
    showModalMap?: boolean
}
const initialState = {
    layers: [],
    collapsedGroups: {},
    showModalSymbol: false,
    showModalMap: false
};

const subject = new BehaviorSubject<MapEditorState>(initialState);

const setMapInfo = (mapInfo: MapInfo) => {
    const layers: LayerStyle[] = [];
    mapInfo.layers.forEach(l => {
        const layerStyle: LayerStyle = {
            name: l.layerName,
            layerGroup: l.layerGroup,

            sourceId: l.dataSourceId,
            layerType: geo2LayerType(l.dataSourceGeoType),
            visibility: l.active,
            minZoom: l.minZoom,
            maxZoom: l.maxZoom,
            note: l.note,
            style: l.paintProperties
        };
        layers.push(layerStyle);
    })

    setMapInfoState({
        id: mapInfo.id,
        name: mapInfo.name,
        version: mapInfo.version || 0,
        boundingBox: mapInfo.boundingBox
    }, layers);
}

const setMapInfoState = (mapInfo: MapInfoState, layers: LayerStyle[]) => {
    setNextState({
        mapInfo: { ...mapInfo },
        layers: [...layers]
    });
}
const setLayers = (layers: LayerStyle[]) => {
    setNextState({ layers: [...layers] });
}

const setCollapsedGroups = (collapsedGroups: { [key: string]: boolean }) => {
    setNextState({ collapsedGroups: { ...collapsedGroups } });
}

const onLayerAction = (layerIndex: number, action: string) => {
    //action : select | delete | visibility
    let { layers, selectedLayerIndex } = subject.getValue();
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
            if (selectedLayerIndex == layerIndex) {
                const selectedIndex = layerIndex > 0 ? layerIndex - 1
                    : (layers.length > 0 ? layerIndex : undefined);
                setNextState({ layers: layers, selectedLayerIndex: selectedIndex });
            } else {
                setNextState({ layers: layers });
            }
            break;
    }
};


const onLayerPropertyChange = (layerIndex: number, property: string, newValue: any) => {
    let { layers } = subject.getValue();
    const layer = layers[layerIndex];
    const newLayer = {
        ...layer,
        [property]: newValue
    }
    layers[layerIndex] = newLayer;
    setNextState({ layers: [...layers] });
}

const onLayerStyleChange = (layerIndex: number, property: string, newValue: any) => {
    let { layers } = subject.getValue();
    const layer = layers[layerIndex];
    const newLayer = {
        ...layer,
        style: {
            ...layer.style,
            [property]: newValue
        }
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

const showModal = (modal: 'symbol' | 'map', isShow: boolean) => {
    if (modal == 'symbol') {
        setNextState({ showModalSymbol: isShow });
    } else if (modal == 'map') {
        setNextState({ showModalMap: isShow });
    }

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
    const saveMap = async () => {
        let { mapInfo, layers } = subject.getValue();
        if (!mapInfo) return;

        const id = mapInfo.id;
        const mapLayers: MapLayer[] = layers.map(o => {
            return {
                layerName: o.name,
                layerGroup: o.layerGroup,
                paintProperties: o.style,
                dataSourceId: o.sourceId || '',
                minZoom: o.minZoom,
                maxZoom: o.maxZoom,
                active: o.visibility,
                note: o.note
            }
        });
        const mapUpdate: MapInfo = {
            id: id,
            name: mapInfo.name,
            layers: mapLayers
        }


        const repsonse = api.update(id, mapUpdate);
        const updatedMap = await handleAxiosApi<MapInfo>(repsonse);
        setMapInfo(updatedMap);
    }

    const observable = getObservable();
    const mapEditorState = useObservable<MapEditorState>(observable);
    return {
        mapEditorState,
        setMapInfo,
        setMapInfoState,
        setLayers,
        setCollapsedGroups,
        addLayer,

        onLayerPropertyChange,
        onLayerStyleChange,
        onLayerAction,

        saveMap,

        showModal,

        getObservable,
    };
}