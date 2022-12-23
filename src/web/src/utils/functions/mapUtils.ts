import { AppWindow } from "../../config/AppWindow";
import { AppSettings } from "../../models/AppSettings";
import { parseData } from "./dataUtils";

declare let window: AppWindow;
//const mapPage: string = window.ENV.Map.mapPage;
const defaultCenter: [number, number] = window.ENV.Map.center;
const defaultZoom: number = window.ENV.Map.zoom;
const defaultMinZoom: number = window.ENV.Map.minZoom;
const defaultMaxZoom: number = window.ENV.Map.maxZoom;
const defaultBoundingBox: [[number, number], [number, number]] | undefined = window.ENV.Map.boundingBox;

export interface MapConfig {
    center: L.LatLngTuple,
    zoom: number,
    boundingBox: [[number, number], [number, number]],
    layers: {id:string, url: string}[],
    minZoom?: number,
    maxZoom?: number,
}

export const parseMapConfig = (appSettings: AppSettings[]): MapConfig => {
    let centerValue = appSettings.find(o => o.code === 'MapDefaultCenter')?.value;
    let zoomValue = appSettings.find(o => o.code === 'MapDefaultZoom')?.value;
    let boundingBoxValue = appSettings.find(o => o.code === 'MapBounding')?.value;
    let layersValue = appSettings.find(o => o.code === 'MapTileLayers')?.value;

    let center = parseData<[number, number]>(centerValue, defaultCenter);
    let zoom = parseData<number>(zoomValue, defaultZoom);
    let boundingBox = parseData<[[number, number], [number, number]] | undefined>(boundingBoxValue, defaultBoundingBox);
    let layers = parseData< {id:string, url: string}[]>(layersValue, []);
    return {
        center: center,
        zoom: zoom,
        boundingBox: boundingBox,
        layers: layers,
        minZoom: defaultMinZoom,
        maxZoom: defaultMaxZoom
    };
}