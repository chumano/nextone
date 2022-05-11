import { DataSourceType, GeoType } from "../Types";

export interface CreateDataSourceDTO{
    name: string;
    dataSourceType: DataSourceType.shapeFile,
    file : any;
    tags? : string [];
}

export interface UpdateDataSourceDTO{
    name: string;
    tags? : string [];
}

export interface SearchDataSourceDTO{
    textSearch? : string;
    geoTypes?: GeoType[]
    offset? : number;
    pageSize?: number;
}