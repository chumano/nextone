export interface AppConfig {
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
