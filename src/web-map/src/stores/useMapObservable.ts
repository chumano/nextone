import { BehaviorSubject } from "rxjs";
import { ErrorPayload, ErrorState, FlagPayload, FlagState, MapInfo } from "../interfaces";
export type MapState = {
    maps: MapInfo[];
} & FlagState & ErrorState;

export type MapPayload =
  | { maps: MapInfo[] }
  | { map: MapInfo }
  | { id: string; map: MapInfo }
  | { id: string }
  | ErrorPayload
  | FlagPayload;

const initialState = {
    maps: [],
    listing: false,
    creating: false,
    updating: false,
    removing: false,
    error: '',
};

const mapSubject = new BehaviorSubject<MapState>(initialState);

export const useMapObservable = () => {
    const list = (maps: MapInfo[]) => {
        setNextState({ maps, error: '' });
    };

    const listing = (flag: boolean) => {
        setNextState({ listing: flag });
    };

    const create = (map: MapInfo) => {
        const maps = [...mapSubject.getValue().maps, map];
        setNextState({ maps, error: '' });
    };

    const creating = (flag: boolean) => {
        setNextState({ creating: flag });
    };

    const update = (id: string, map: MapInfo) => {
        let maps = [...mapSubject.getValue().maps];
        maps = maps.map((item) => {
            if (item.id === id) {
                return { ...item, ...map };
            }

            return item;
        });

        setNextState({ maps, error: '' });
    };

    const updating = (flag: boolean) => {
        setNextState({ updating: flag });
    };

    const remove = (id: string) => {
        const maps = [...mapSubject.getValue().maps].filter((map) => map.id !== id);
        setNextState({ maps, error: '' });
    };

    const removing = (flag: boolean) => {
        setNextState({ removing: flag });
    };

    const error = (message: string) => {
        setNextState({ error: message });
    };

    const setNextState = (payload: MapPayload) => {
        const state = mapSubject.getValue();
        mapSubject.next({ ...state, ...payload });
    };

    const getObservable = () => {
        return mapSubject;
    };

    return {
        list,
        listing,
        create,
        creating,
        update,
        updating,
        remove,
        removing,
        error,
        getObservable,
    };
};