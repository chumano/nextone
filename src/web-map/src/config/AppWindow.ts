export interface AppWindow extends Window {
    ENV: {
        Map: {
            center: [number, number];
            zoom: number;
            boundingBox?: [ [number, number], [number, number]] ;
            googleApiKey: string;
        }
    }
}