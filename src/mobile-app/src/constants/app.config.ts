import {
  AppConfig,
  OAuthConfig,
  OAuthRefreshTokenConfig,
} from './../types/AppConfig.type';

export const APP_CONFIG: AppConfig = {
  WEBAPP: 'https://ucom.dientoan.vn',
  IDENTITY_HOST: 'https://ucom-id.dientoan.vn',
  MASTER_HOST: 'https://ucom-apis.dientoan.vn/master',
  COM_HOST: 'https://ucom-apis.dientoan.vn/com',
  MAP_HOST: 'https://ucom-apis.dientoan.vn/map',
  FILE_HOST: 'https://ucom-apis.dientoan.vn/file',
};

export const OAUTH_CONFIG: OAuthConfig = {
  client_id: 'native-app',
  client_secret: '',
  grant_type: 'password',
  scope: 'openid profile gateway master-scope offline_access',
};

export const OAUTH_REFRESH_TOKEN_CONFIG: OAuthRefreshTokenConfig = {
  client_id: 'native-app',
  client_secret: '',
  grant_type: 'refresh_token',
};
