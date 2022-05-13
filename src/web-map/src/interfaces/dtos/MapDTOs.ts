import { MapLayer } from "../Map"

export interface CreateMapDTO{
    name:string,
}

export interface UpdateMapNameDTO{
    name:string,
    note?:string
}

export interface PublishMapDTO{
    isPublished: boolean,
}

export interface UpdateMapLayersDTO{
    id: string,
    name: string,
    layers: MapLayer[]
}

export interface SearchMapDTO{
    textSearch? : string;
    offset? : number;
    pageSize?: number;
    publishState?: number;
}