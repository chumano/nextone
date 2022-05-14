import { DataSourceType, GeoType } from "./Types";

export interface ColumnType{
    Name: string;
    Type: string;
}
export interface FeatureData{
    [key:string]: any
}
export interface DataSource{
    id: string;
    name: string;
    dataSourceType: DataSourceType;
    geoType : GeoType
    properties : any;
    pourceFile : string;
    imageUrl?: string;
    tags?: string[];
    featureData?: FeatureData[]
}

