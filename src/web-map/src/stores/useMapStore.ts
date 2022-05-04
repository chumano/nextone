import { useMapApi } from "../apis";
import { MapInfo } from "../interfaces";
import { CreateMapDTO } from "../interfaces/dtos";
import { getResponseErrorMessage, handleAxiosApi } from "../utils/functions";
import { useObservable } from "../utils/hooks";
import { MapState, useMapObservable } from "./useMapObservable";

export const useMapStore = () => {
    const api = useMapApi();
    const observable = useMapObservable();
  
    const getMapObservable = () => observable.getObservable();
    const mapState = useObservable<MapState>(observable.getObservable());

    const list = async () => {
      try {
        observable.listing(true);
        const objs = await handleAxiosApi<MapInfo[]>(api.list());
        observable.list(objs);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.listing(false);
      }
    };

    const get = async (id: string,) => {
      return await handleAxiosApi<MapInfo>(api.get(id));
    };
  
    const create = async (obj: CreateMapDTO) => {
      try {
        observable.creating(true);
        const createdObj = await handleAxiosApi<MapInfo>(api.create(obj));
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
  
    const update = async (id: string, obj: MapInfo) => {
      try {
        observable.updating(true);
        const updatedCustomer = await handleAxiosApi<MapInfo>(api.update(id, obj));
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
      mapState,
      list,
      get,
      create,
      update,
      remove,
      getMapObservable,
    };
  };