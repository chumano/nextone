import { AppSettings } from "../types/AppSettings";

const defaultCenter: [number, number] = [0,0];
const defaultZoom: number = 11;
const defaultMinZoom: number = 10;
const defaultMaxZoom: number = 20;
const defaultBoundingBox: [[number, number], [number, number]] | undefined = undefined;

export interface MapConfig {
    center:  [number, number],
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

export function parseData<T>(value: string | undefined, defaultValue: T) {
    if (value === "" || value === null || value === undefined) {
        return defaultValue
    }

    try {
        return JSON.parse(value);
    } catch { }

    return defaultValue;
}