import { BehaviorSubject } from "rxjs";
import { useObservable } from "../../utils/hooks";

interface MapEditorState{
    layers: any[];
}
const initialState = {
    layers: [],
};

const subject = new BehaviorSubject<MapEditorState>(initialState);

const setLayers = (layers: any[])=>{
    setNextState({ layers: [...layers]});
}

const toggleLayerVisibility = (layerIndex: number) => {
    let layers = [...subject.getValue().layers];
    layers = layers.map((item, index) => {
        if (index === layerIndex) {
            return { ...item, ...{visibility : !item.visibility } };
        }

        return item;
    });

    setNextState({ layers: layers});
};




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
        toggleLayerVisibility,
        getObservable,
    };
}