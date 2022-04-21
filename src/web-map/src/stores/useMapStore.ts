import { useMapApi } from "../apis";
import { MapInfo } from "../interfaces";
import { getResponseErrorMessage, handleAxiosApi } from "../utils/functions";
import { useMapObservable } from "./useMapObservable";

export const useMapStore = () => {
    const api = useMapApi();
    const observable = useMapObservable();
  
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
  
    const create = async (obj: MapInfo) => {
      try {
        observable.creating(true);
        const createdObj = await handleAxiosApi<MapInfo>(api.create(obj));
        observable.create(createdObj);
      } catch (error) {
        observable.error(getResponseErrorMessage(error));
      } finally {
        observable.creating(false);
      }
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
  
    const getMapObservable = () => observable.getObservable();
  
    return {
      list,
      create,
      update,
      remove,
      getMapObservable,
    };
  };