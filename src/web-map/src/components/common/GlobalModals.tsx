import React, { useState, createContext, useContext } from 'react';
import InfoModal from '../modals/InfoModal';

export const MODAL_TYPES = {
    INFO_MODAL: 'INFO_MODAL' as ModalType
};

export type ModalType = 'INFO_MODAL';

const MODAL_COMPONENTS: any = {
    [MODAL_TYPES.INFO_MODAL]: InfoModal,
};

type GlobalModalContext = {
    showModal: (modalType: ModalType, modalProps?: any) => void;
    hideModal: () => void;
    store: any;
};

const initalState: GlobalModalContext = {
    showModal: () => { },
    hideModal: () => { },
    store: {},
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<{ children: any }> = ({ children }) => {
    const [store, setStore] = useState<any>();
    const { modalType, modalProps } = store || {};

    const showModal = (modalType: ModalType, modalProps: any = {}) => {
        setStore({
            ...store,
            modalType,
            modalProps,
        });
    };

    const hideModal = () => {
        setStore({
            ...store,
            modalType: null,
            modalProps: null,
        });
    };

    const renderModal = () => {
        const ModalComponent = MODAL_COMPONENTS[modalType];
        if (!modalType || !ModalComponent) {
            return null;
        }
        return <ModalComponent id="global-modal" {...modalProps} />;
    };

    return (
        <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
            {children}
            {renderModal()}
        </GlobalModalContext.Provider>
    );
};