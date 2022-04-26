import { useDatasourceApi, } from "../apis";
import { DataSource } from "../interfaces";
import { getResponseErrorMessage, handleAxiosApi } from "../utils/functions";
import { useObservable } from "../utils/hooks";
import { DatasourceState, useDatasourceObservable } from "./useDataSourceObservable";

export const useDatasourceStore = () => {
    const api = useDatasourceApi();
    const observable = useDatasourceObservable();
    const getObservable = () => observable.getObservable();
    const objState = useObservable<DatasourceState>(observable.getObservable());

    const list = async () => {
      try {
        observable.listing(true);
        const objs = await handleAxiosApi<DataSource[]>(api.list());
        observable.list(objs);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.listing(false);
      }
    };
  
    const create = async (obj: any) => {
      try {
        observable.creating(true);
        const createdObj = await handleAxiosApi<DataSource>(api.create(obj));
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
  
    const update = async (id: string, obj: DataSource) => {
      try {
        observable.updating(true);
        const updatedCustomer = await handleAxiosApi<DataSource>(api.update(id, obj));
        observable.update(id, updatedCustomer);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.updating(false);
      }
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
      datasourceState: objState,
      list,
      create,
      update,
      remove,
      getDatasourceObservable : getObservable,
    };
  };

