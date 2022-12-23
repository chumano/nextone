export interface AppSettings{
    code: string,
    name: string,
    value: string,
    group: string
}

export interface IIceServer {
    urls: string[];
    username?: string;
    credential?: string
}
export interface IApplicationSettings {
    maxFindUserDistanceInMeters: number,
    callTimeOutInSeconds: number,
    updateLocationHeartbeatInSeconds: number,
    iceServers: RTCIceServer[];
}