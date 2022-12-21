export interface AppWindow extends Window {
    ENV: {
        Map: {
            center: [number, number];
            zoom: number;
            minZoom: number;
            maxZoom: number;
            boundingBox?: [ [number, number], [number, number]] ;
            googleApiKey: string;
            baseMapUrl: string;
            mapPage: string
        },
        Identity: {
            identityUrl : string
        },
        Apis:{
            masterUrl : string,
            comUrl : string,
            mapUrl : string,
            fileUrl : string,
        },
        useWebrtcUtils: boolean
    }
}