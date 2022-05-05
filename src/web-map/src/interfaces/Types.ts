export type LayerType = 'point' | 'line' | 'fill' |  string;

export enum GeoType{
    point,
    line,
    fill,
    other
}

export enum DataSourceType{
    shapeFile,
}

export type PaintPropertyKey = string;

export enum DashStyle
{
    solid,
    dash,
    dot,
    dashDot,
    dashDotDot,
    custom
}

export const ShapeFileProps = {
    COLUMNS : "ShapeFile_Columns",
    SRID : "ShapeFile_SRID",
    FEATURECOUNT: "ShapeFile_FeatureCount",
}