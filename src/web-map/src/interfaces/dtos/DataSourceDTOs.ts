import { DataSourceType } from "../Types";

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