import { PayloadAction} from '@reduxjs/toolkit';
import React, { ReactNode } from 'react'
import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue,
} from 'react-redux'
import { INewsStore, newsStore } from './newsStore';

export interface INewsContext 
    extends ReactReduxContextValue<INewsStore, PayloadAction<any>> {
}

const NewsContext = React.createContext<INewsContext>({} as any);

//hooks for context
export const useNewsStore = createStoreHook(NewsContext)
export const useNewsDispatch = createDispatchHook(NewsContext)
export const useNewsSelector = createSelectorHook(NewsContext)

export const NewsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <Provider context={NewsContext as any} store={newsStore}>
            {children}
        </Provider>
    )
}

