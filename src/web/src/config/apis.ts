export interface AppWindow extends Window {
    ENV: {
        Map: {
            center: [number, number];
            zoom: number;
            boundingBox?: [ [number, number], [number, number]] ;
            googleApiKey: string;
        },
        Identity: {
            identityUrl : string
        },
        Apis:{
            masterUrl : string,
            comUrl : string,
            mapUrl : string,
            fileUrl : string,
        }
    }
}
declare let window: AppWindow;

export const IDENTITY_API = window.ENV.Identity.identityUrl;

const API = {
    ID_SERVICE : window.ENV.Identity.identityUrl,

    GATEWAY : "http://localhost:5101",

    MASTER_SERVICE: window.ENV.Apis.masterUrl,
    COM_SERVICE : window.ENV.Apis.comUrl,
    MAP_SERVICE : window.ENV.Apis.mapUrl,
    FILE_SERVICE : window.ENV.Apis.fileUrl,
};

export default API;