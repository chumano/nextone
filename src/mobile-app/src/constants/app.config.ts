import {AppConfig, OAuthConfig} from './../types/AppConfig.type';

export const APP_CONFIG: AppConfig = {
  IDENTITY_HOST: 'https://id.tris.vn', //'https://192.168.1.101:5102',
  MASTER_HOST: 'http://192.168.1.101:5103',
  COM_HOST: 'http://192.168.1.101:5104',
  MAP_HOST: 'http://192.168.1.101:5105',
  FILE_HOST: 'http://192.168.1.101:5106',
};

export const OAUTH_CONFIG: OAuthConfig = {
  client_id: 'native-app',
  client_secret: '',
  grant_type: 'password',
  scope: 'openid profile gateway master-scope offline_access',
};
