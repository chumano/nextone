import { GeoType } from "../../interfaces";

//LayerType : 'point' | 'line' | 'fill'  | 'symbol' | string;

export const geo2LayerType = (geoType? : GeoType)=> {
    switch(geoType){
        case GeoType.Point:
            return 'point';
        case GeoType.Line:
            return 'line';
        case GeoType.Fill:
            return 'fill';
    }
    return '';
}


export  const layerType2Geo = (layerType : string)=> {
    switch(layerType){
        case 'point':
            return GeoType.Point;
        case 'line':
            return GeoType.Line ;
        case 'fill':
            return GeoType.Fill;
    }
    return GeoType.Other;
}