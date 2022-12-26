export interface MediaItemType {
    uri: string;
    name: string;
    type: string;
    mediaType: MEDIA_TYPE;
    thumbnailUri?: string;
    size?: number;
}

export enum MEDIA_TYPE {
    VIDEO,
    IMAGE,
}