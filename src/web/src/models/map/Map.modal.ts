
export interface MapInfo {
    id: string;
    name: string;
    note?: string;
    imageUrl?: string;
    version?: number;
    boundingBox?: any;
    currentTileUrl: string;
    latestTileUrl: string;
}