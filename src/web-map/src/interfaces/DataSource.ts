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
    Fill,
    Other
}

export enum DataSourceType{
    ShapeFile,
}