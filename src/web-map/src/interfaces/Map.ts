import { DataSource, GeoType } from "./DataSource"
import { PaintPropertyKey } from "./PaintProperty";

export interface MapInfo {
    Id?: string;
    Name: string;
    Layers: MapLayer[]
}

export interface MapLayer {
    LayerName: string;
    LayerGroup: string;
    DataSourceId: string;
    DataSourceName?: string;
    DataSourceGeoType?: GeoType;

    PaintProperties?: { [key: PaintPropertyKey]: any }

    Active?: boolean;
    MinZoom?: number;
    MaxZoom?: number;
    Note?: string;
}
