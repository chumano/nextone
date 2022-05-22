import { PageOptions } from "../../models/apis/PageOptions.model";
import { User } from "../../models/user/User.model";

import { Dispatch, FC, ReactNode, useReducer } from "react";
import { createContext } from "react";

export interface UserContext {
	state: UserState;
	dispatch: Dispatch<UserAction>;
}

interface UserState {
	data: User[];
	offset: number;
	pageSize: number;

	status: "loading" | "success" | "failed";
	errorMessage: string | null;

	isReloadTable: boolean;

	currentUser: User | null;
}

export const UserCtx = createContext<UserContext | null>(null);

export enum UserActionType {
	GET_LIST_USER = "user/GET_LIST_USER",
	GET_LIST_USER_SUCCESS = "user/GET_LIST_USER_success",
	GET_LIST_USER_FAILED = "user/GET_LIST_USER_failed",
	GET_COUNT_USER = "user/GET_COUNT_USER",

	SET_OFFSET_USER_PAGE = "user/SET_OFFSET_USER_PAGE",

	SET_CURRENT_USER_CLICKED = "user/SET_CURRENT_USER_CLICKED",

	SET_UPDATE_USER_MODAL = "user/SET_UPDATE_USER_MODAL",
	SET_DELETE_USER_MODAL = "user/SET_DELETE_USER_MODAL",
	SET_RELOAD_USER_TABLE = "user/SET_RELOAD_USER_TABLE",
}

export type UserAction =
	| {
			type: UserActionType.GET_LIST_USER;
			payload: { offset: number; pageSize: number; textSearch: string };
	  }
	| { type: UserActionType.GET_LIST_USER_SUCCESS; payload: User[] }
	| { type: UserActionType.GET_LIST_USER_FAILED; payload: string }
	| { type: UserActionType.SET_OFFSET_USER_PAGE; payload: number }
	| { type: UserActionType.SET_RELOAD_USER_TABLE; payload: boolean }
	| { type: UserActionType.SET_CURRENT_USER_CLICKED; payload: User | null };

const { offset, pageSize } = new PageOptions();

const USER_INITIAL_STATE: UserState = {
	data: [],
	offset,
	pageSize,
	status: "loading",
	errorMessage: null,
	isReloadTable: false,
	currentUser: null,
};

const userReducer = (
	state: UserState = USER_INITIAL_STATE,
	action: UserAction
): UserState => {
	switch (action.type) {
		case UserActionType.GET_LIST_USER:
			return USER_INITIAL_STATE;

		case UserActionType.GET_LIST_USER_SUCCESS:
			return { ...state, status: "success", data: action.payload };
		case UserActionType.GET_LIST_USER_FAILED:
			return { ...state, errorMessage: action.payload };
		case UserActionType.SET_OFFSET_USER_PAGE:
			return { ...state, offset: action.payload };
		case UserActionType.SET_RELOAD_USER_TABLE:
			return { ...state, isReloadTable: action.payload };
		case UserActionType.SET_CURRENT_USER_CLICKED:
			return { ...state, currentUser: action.payload };
		default:
			throw new Error(`Unhandled action type - ${JSON.stringify(action)} `);
	}
};

const UserProvider: FC<ReactNode> = ({ children }) => {
	const [state, dispatch] = useReducer(userReducer, USER_INITIAL_STATE);
	return (
		<UserCtx.Provider value={{ state, dispatch }}>{children}</UserCtx.Provider>
	);
};

export default UserProvider;
