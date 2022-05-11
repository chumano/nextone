import { BehaviorSubject } from "rxjs";
import { ErrorPayload, ErrorState, FlagPayload, FlagState, DataSource } from "../interfaces";
export type DatasourceState = {
    count: number;
    datasources: DataSource[];
} & FlagState & ErrorState;

export type DatasourcePayload =
  | { datasources: DataSource[] }
  | { datasources: DataSource[], count: number }
  | { source: DataSource }
  | { id: string; source: DataSource }
  | { id: string }
  | ErrorPayload
  | FlagPayload;

const initialState = {
    count: 0,
    datasources: [],
    listing: false,
    creating: false,
    updating: false,
    removing: false,
    error: '',
};

const datasourceSubject = new BehaviorSubject<DatasourceState>(initialState);

export const useDatasourceObservable = () => {
    const list = (objs: DataSource[]) => {
        setNextState({ datasources: objs, error: '' });
    };

    const listAndCount = (objs: DataSource[], count: number ) => {
        setNextState({
            datasources: objs, 
            count : count,
            error: '' 
        });
    };

    const listing = (flag: boolean) => {
        setNextState({ listing: flag });
    };

    const create = (obj: DataSource) => {
        const objs = [obj,...datasourceSubject.getValue().datasources];
        setNextState({ datasources: objs, error: '' });
    };

    const creating = (flag: boolean) => {
        setNextState({ creating: flag });
    };

    const update = (id: string, obj: DataSource) => {
        let objs = [...datasourceSubject.getValue().datasources];
        objs = objs.map((item) => {
            if (item.id === id) {
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
        const objs = [...datasourceSubject.getValue().datasources].filter((obj) => obj.id !== id);
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
        listAndCount,
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