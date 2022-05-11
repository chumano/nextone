export interface AppWindow extends Window {
    ENV: {
        Map: {
            center: [number, number];
            zoom: number;
            boundingBox?: [ [number, number], [number, number]] ;
            googleApiKey: string;
            apiUrl?: string
        }
    }
}
declare let window: AppWindow;
export const MAP_API  = window.ENV.Map.apiUrl || process.env.REACT_APP_MAP_API;