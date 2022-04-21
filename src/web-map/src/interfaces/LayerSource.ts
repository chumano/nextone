export interface LayerSource{
    Id: string;
    Name: string;
    Type: LayerSourceType;
    Properties : any;
    SourceFile : string;
}

export enum LayerSourceType{
    Point,
    Text,
    Line,
    Fill
}