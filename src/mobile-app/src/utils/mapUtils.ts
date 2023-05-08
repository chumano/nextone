import { AppSettings } from "../types/AppSettings";

const defaultCenter: [number, number] = [0,0];
const defaultZoom: number = 11;
const defaultMinZoom: number = 7;
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
    let minZoomValue = appSettings.find(o => o.code === 'MapMinZoom')?.value;
    let maxZoomValue = appSettings.find(o => o.code === 'MapMaxZoom')?.value;
    let boundingBoxValue = appSettings.find(o => o.code === 'MapBounding')?.value;
    let layersValue = appSettings.find(o => o.code === 'MapTileLayers')?.value;

    let center = parseData<[number, number]>(centerValue, defaultCenter);
    let zoom = parseData<number>(zoomValue, defaultZoom);
    let minZoom = parseData<number>(minZoomValue, defaultMinZoom);
    let maxZoom = parseData<number>(maxZoomValue, defaultMaxZoom);
    let boundingBox = parseData<[[number, number], [number, number]] | undefined>(boundingBoxValue, defaultBoundingBox);
    let layers = parseData< {id:string, url: string}[]>(layersValue, []);
    return {
        center: center,
        zoom: zoom,
        boundingBox: boundingBox,
        layers: layers,
        minZoom: minZoom,
        maxZoom: maxZoom
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

export interface LatLngType {
    lat: number;
    lon: number;
  }
  
export const getDistanceFromLatLonInM = (
    latLng1: LatLngType,
    latLng2: LatLngType
  ) => {
    var R = 6371000; // Radius of the earth in m
    var dLat = deg2rad(latLng2.lat - latLng1.lat); // deg2rad below
    var dLon = deg2rad(latLng2.lon - latLng1.lon);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(latLng1.lat)) *
        Math.cos(deg2rad(latLng2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in m
    return d;
};
  
const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};