import { configureStore, createSlice } from "@reduxjs/toolkit";
import { createStore } from "redux";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

const persistedData = loadState();

const initialState: any = {
    data: persistedData
}

export const persistedSlice = createSlice({
    name: 'persisted',
    initialState,
    reducers: {
        setData(state) {

        }
    },
})

interface IPersittedStore {
    persistedState: any
}

export const persisteStore = configureStore<IPersittedStore>({
    reducer: {
        persistedState: persistedSlice.reducer
    },
})


persisteStore.subscribe(() => {
    saveState({
        data: persisteStore.getState().persistedState.data
    });
});