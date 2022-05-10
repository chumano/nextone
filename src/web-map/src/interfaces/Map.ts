import { GeoType, MapBoudingBox as MapBoundingBox, PaintPropertyKey } from "./Types";

export interface MapInfo {
    id: string;
    name: string;
    note?: string;
    imageUrl?: string;
    version?: number;
    boundingBox?: MapBoundingBox;
    layers: MapLayer[]
}

export interface MapLayer {
    layerName: string;
    layerGroup: string;
    dataSourceId: string;
    dataSourceName?: string;
    dataSourceGeoType?: GeoType;

    paintProperties?: { [key: PaintPropertyKey]: any }

    active?: boolean;
    minZoom?: number;
    maxZoom?: number;
    note?: string;
}
