import { GeoType } from "../../interfaces";

//LayerType : 'point' | 'line' | 'fill'  | 'symbol' | string;

export const geo2LayerType = (geoType? : GeoType)=> {
    switch(geoType){
        case GeoType.point:
            return 'point';
        case GeoType.line:
            return 'line';
        case GeoType.fill:
            return 'fill';
    }
    return '';
}


export  const layerType2Geo = (layerType : string)=> {
    switch(layerType){
        case 'point':
            return GeoType.point;
        case 'line':
            return GeoType.line ;
        case 'fill':
            return GeoType.fill;
    }
    return GeoType.other;
}