export interface AppWindow extends Window {
    ENV: {
        Map: {
            center: [number, number];
            zoom: number;
            boundingBox?: [ [number, number], [number, number]] ;
            googleApiKey: string;
            apiUrl?: string
        },
        Identity: {
            identityUrl : string
        }
    }
}
declare let window: AppWindow;

export const IDENTITY_API = window.ENV.Identity.identityUrl;
export const MAP_API  = window.ENV.Map.apiUrl || process.env.REACT_APP_MAP_API;