import { useSymbolApi, } from "../apis";
import { Symbol } from "../interfaces";
import { getResponseErrorMessage, handleAxiosApi } from "../utils/functions";
import { useObservable } from "../utils/hooks";
import { SymbolState, useSymbolObservable } from "./useSymbolObservable";

export const useSymbolStore = () => {
    const api = useSymbolApi();
    const observable = useSymbolObservable();
    const getObservable = () => observable.getObservable();
    const objState = useObservable<SymbolState>(observable.getObservable());

    const list = async () => {
      try {
        observable.listing(true);
        const objs = await handleAxiosApi<Symbol[]>(api.list());
        observable.list(objs);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.listing(false);
      }
    };
  
    const create = async (obj: {name:string, file:any}) => {
      try {
        observable.creating(true);
        const createdObj = await handleAxiosApi<Symbol>(api.create(obj));
        //await new Promise(f => setTimeout(f, 1000));
         
        observable.create(createdObj);

        return createdObj;
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.creating(false);
      }
      return undefined;
    };
  
  
    const remove = async (id: string) => {
      try {
        observable.removing(true);
        await handleAxiosApi(api.remove(id));
        observable.remove(id);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.removing(false);
      }
    };
  
    return {
      symbolState: objState,
      list,
      create,
      remove,
      getDatasourceObservable : getObservable,
    };
  };

