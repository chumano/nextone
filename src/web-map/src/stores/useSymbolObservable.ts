import { BehaviorSubject } from "rxjs";
import { ErrorPayload, ErrorState, FlagPayload, FlagState, Symbol } from "../interfaces";
export type SymbolState = {
    symbols: Symbol[];
} & FlagState & ErrorState;

export type SymbolPayload =
  | { symbols: Symbol[] }
  | { symbol: Symbol }
  | { name: string; symbol: Symbol }
  | { name: string }
  | ErrorPayload
  | FlagPayload;

const initialState = {
    symbols: [],
    listing: false,
    creating: false,
    updating: false,
    removing: false,
    error: '',
};

const symbolSubject = new BehaviorSubject<SymbolState>(initialState);

export const useSymbolObservable = () => {
    const list = (objs: Symbol[]) => {
        setNextState({ symbols: objs, error: '' });
    };

    const listing = (flag: boolean) => {
        setNextState({ listing: flag });
    };

    const create = (obj: Symbol) => {
        const objs = [obj,...symbolSubject.getValue().symbols];
        setNextState({ symbols: objs, error: '' });
    };

    const creating = (flag: boolean) => {
        setNextState({ creating: flag });
    };

    const remove = (name: string) => {
        const objs = [...symbolSubject.getValue().symbols].filter((obj) => obj.name !== name);
        setNextState({ symbols: objs, error: '' });
    };

    const removing = (flag: boolean) => {
        setNextState({ removing: flag });
    };

    const error = (message: string) => {
        setNextState({ error: message });
    };

    const setNextState = (payload: SymbolPayload) => {
        const state = symbolSubject.getValue();
        symbolSubject.next({ ...state, ...payload });
    };

    const getObservable = () => {
        return symbolSubject;
    };

    return {
        list,
        listing,
        create,
        creating,
        remove,
        removing,
        error,
        getObservable,
    };
};