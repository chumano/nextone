export interface AppConfig {
  WEBAPP: string;
  IDENTITY_HOST: string;
  MASTER_HOST: string;
  COM_HOST: string;
  MAP_HOST: string;
  FILE_HOST: string;
}

export interface OAuthConfig {
  client_id: string;
  client_secret: string;
  scope: string;
  grant_type: string;
  username?: string;
  password?: string;
}

export interface OAuthRefreshTokenConfig {
  client_id: string;
  client_secret: string;
  grant_type: string;
  refresh_token?: string;
}

export interface RTCIceServer {
  urls: string | string[];
  username?: string;
  credential?: string
}

export interface IApplicationSettings {
  maxFindUserDistanceInMeters: number,
  callTimeOutInSeconds: number,
  updateLocationHeartbeatInSeconds: number,
  iceServers: RTCIceServer[];
}

export interface IGlobalData {
  applicationSettings?: IApplicationSettings
}