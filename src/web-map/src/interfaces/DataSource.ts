export interface DataSource{
    Id: string;
    Name: string;
    DataSourceType: DataSourceType;
    GeoType : GeoType
    Properties : any;
    SourceFile : string;
    Tags?: string[];
}

export enum GeoType{
    Point,
    Line,
    Fill
}

export enum DataSourceType{
    ShapeFile,
}