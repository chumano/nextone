import { PayloadAction} from '@reduxjs/toolkit';
import React, { ReactNode } from 'react'
import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue,
} from 'react-redux'
import { IMapStore, mapStore } from './mapStore';

export interface IMapContext extends ReactReduxContextValue<IMapStore, PayloadAction<any>> {
    
}

const MapContext = React.createContext<IMapContext>({} as any);

//hooks for context
export const useMapStore = createStoreHook(MapContext)
export const useMapDispatch = createDispatchHook(MapContext)
export const useMapSelector = createSelectorHook(MapContext)

export const MapProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <Provider context={MapContext as any} store={mapStore}>
            {children}
        </Provider>
    )
}

