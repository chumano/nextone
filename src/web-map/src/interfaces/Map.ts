import { DataSource, GeoType } from "./DataSource"
import { PaintPropertyKey } from "./PaintProperty";

export interface MapInfo {
    Id?: string;
    Name: string;
    Layers?: MapLayer[]
}

export interface MapLayer {
    Name: string;
    SourceType: GeoType;
    Source: DataSource;
    LayerGroup: string;

    PaintProperties: { [key: PaintPropertyKey]: any }
    MinZoom?: number;
    MaxZoom?: number;
    Note?: string;
}
