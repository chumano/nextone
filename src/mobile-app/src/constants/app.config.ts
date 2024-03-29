import {
  AppConfig,
  OAuthConfig,
  OAuthRefreshTokenConfig,
} from './../types/AppConfig.type';
//deploy
export const APP_CONFIG_DEPLOY: AppConfig = {
  WEBAPP: 'https://ucom.dientoan.vn',
  IDENTITY_HOST: 'https://ucom-id.dientoan.vn',
  MASTER_HOST: 'https://ucom-apis.dientoan.vn/master',
  COM_HOST: 'https://ucom-apis.dientoan.vn/com',
  MAP_HOST: 'https://ucom-apis.dientoan.vn/map',
  FILE_HOST: 'https://ucom-apis.dientoan.vn/file',
};

//demo
export const APP_CONFIG_DEMO: AppConfig = {
  WEBAPP: 'https://192.168.0.122',
  IDENTITY_HOST: 'https://192.168.0.122:8443',
  MASTER_HOST: 'https://192.168.0.122:7443/master',
  COM_HOST: 'https://192.168.0.122:7443/com',
  MAP_HOST: 'https://192.168.0.122:7443/map',
  FILE_HOST: 'https://192.168.0.122:7443/file',
};

//local
export const APP_CONFIG_LOCAL: AppConfig = {
  WEBAPP: 'http://192.168.0.105',
  IDENTITY_HOST: 'https://192.168.0.105:5102',
  MASTER_HOST: 'http://192.168.0.105:5103',
  COM_HOST: 'http://192.168.0.105:5104',
  MAP_HOST: 'http://192.168.0.105:5105',
  FILE_HOST: 'http://192.168.0.105:5106',
};

//CHANGE_ME
export const APP_CONFIG = APP_CONFIG_DEPLOY;

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

