import 'leaflet';
import { createLayerComponent, updateGridLayer, LeafletContextInterface, LayerProps } from '@react-leaflet/core';

import  tileGrid from './leaflet.gridlayer.tilegrid'
const createLeafletElement = (props: any, context: LeafletContextInterface) => {
    const instance = tileGrid(props)
    return { instance, context };
}

const LayerGridLeaftlet = createLayerComponent<L.GridLayer, LayerProps & any>(
    createLeafletElement,
    updateGridLayer);
export default LayerGridLeaftlet;