export interface UserLoginInfo {
  email: string;
  password: string;
}

export interface UserTokenInfo {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
  tokenType: string;
  userId: string;
}

export interface UserTokenInfoResponse {
  id_token?: string;
  access_token: string;
  expire_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
