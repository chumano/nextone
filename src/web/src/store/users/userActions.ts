import { Dispatch } from "react";
import { UserService } from "../../services";
import { IUser } from "../../utils";

export const UserActionTypes = {
    GET : "GET",
    CREATE : "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    FIND : "FIND",
    GET_ALL : "GET_ALL"
}


export type UserAction = 
    | { type: typeof UserActionTypes.GET, payload: string }
    | { type: typeof UserActionTypes.CREATE, payload: IUser }
    | { type: typeof UserActionTypes.UPDATE, payload: IUser }
    | { type: typeof UserActionTypes.DELETE, payload: string }
    | { type: typeof UserActionTypes.FIND, payload: any }
    | { type: typeof UserActionTypes.GET_ALL, payload: undefined }

const create = (user: IUser) => async (dispatch :Dispatch<any>) => {
    try {
      const res = await UserService.create(user);
  
      dispatch({
        type: UserActionTypes.CREATE,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const get = (id:string) => async (dispatch:Dispatch<any>) => {
    try {
      const res = await UserService.get(id);
  
      dispatch({
        type: UserActionTypes.GET,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const getAll = () => async (dispatch:Dispatch<any>) => {
    try {
      const res = await UserService.getAll();
  
      dispatch({
        type: UserActionTypes.GET,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  
  const update = (user: IUser) => async (dispatch:Dispatch<any>) => {
    try {
      const res = await UserService.update(user);
  
      dispatch({
        type: UserActionTypes.UPDATE,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  const deleteData = (id:string) => async (dispatch:Dispatch<any>) => {
    try {
      await UserService.delete(id);
  
      dispatch({
        type: UserActionTypes.DELETE,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  
  const findByFilters = (filters:any) => async (dispatch:Dispatch<any>) => {
    try {
      const res = await UserService.findBy(filters);
  
      dispatch({
        type: UserActionTypes.FIND,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const userActions = {
    create,
    update,
    deleteData,
    get,
    getAll,
    findByFilters
  }

  export default userActions;