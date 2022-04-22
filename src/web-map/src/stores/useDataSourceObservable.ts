import { BehaviorSubject } from "rxjs";
import { ErrorPayload, ErrorState, FlagPayload, FlagState, LayerSource } from "../interfaces";
export type DatasourceState = {
    datasources: LayerSource[];
} & FlagState & ErrorState;

export type DatasourcePayload =
  | { datasources: LayerSource[] }
  | { source: LayerSource }
  | { id: string; source: LayerSource }
  | { id: string }
  | ErrorPayload
  | FlagPayload;

const initialState = {
    datasources: [],
    listing: false,
    creating: false,
    updating: false,
    removing: false,
    error: '',
};

const datasourceSubject = new BehaviorSubject<DatasourceState>(initialState);

export const useDatasourceObservable = () => {
    const list = (objs: LayerSource[]) => {
        setNextState({ datasources: objs, error: '' });
    };

    const listing = (flag: boolean) => {
        setNextState({ listing: flag });
    };

    const create = (obj: LayerSource) => {
        const objs = [...datasourceSubject.getValue().datasources, obj];
        setNextState({ datasources: objs, error: '' });
    };

    const creating = (flag: boolean) => {
        setNextState({ creating: flag });
    };

    const update = (id: string, obj: LayerSource) => {
        let objs = [...datasourceSubject.getValue().datasources];
        objs = objs.map((item) => {
            if (item.Id === id) {
                return { ...item, ...obj };
            }

            return item;
        });

        setNextState({ datasources: objs, error: '' });
    };

    const updating = (flag: boolean) => {
        setNextState({ updating: flag });
    };

    const remove = (id: string) => {
        const objs = [...datasourceSubject.getValue().datasources].filter((obj) => obj.Id !== id);
        setNextState({ datasources: objs, error: '' });
    };

    const removing = (flag: boolean) => {
        setNextState({ removing: flag });
    };

    const error = (message: string) => {
        setNextState({ error: message });
    };

    const setNextState = (payload: DatasourcePayload) => {
        const state = datasourceSubject.getValue();
        datasourceSubject.next({ ...state, ...payload });
    };

    const getObservable = () => {
        return datasourceSubject;
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