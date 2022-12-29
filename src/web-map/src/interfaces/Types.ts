export type LayerType = 'point' | 'line' | 'fill' |  string;

export enum GeoType{
    point,
    line,
    fill,
    other
}

export const GeoTypeNames : {[key:string]: string}={
    'point': 'Điểm',
    'line': 'Đường',
    'fill': 'Vùng',
    'other': 'Khác' 
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
    //custom
}
export const DashStyleNames : {[key:string]: string}={
    'solid': 'Nét liền',
    'dash': 'Nét đứt',
    'dot': 'Chấm',
    'dashDot': 'Gạch chấm',
    'dashDotDot': 'Gạch chấm chấm' 
}


export const ShapeFileProps = {
    COLUMNS : "ShapeFile_Columns",
    SRID : "ShapeFile_SRID",
    FEATURECOUNT: "ShapeFile_FeatureCount",
}

export interface MapBoudingBox{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}