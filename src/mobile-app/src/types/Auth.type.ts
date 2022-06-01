export interface UserLoginInfo {
  Email: string;
  Password: string;
}

export interface UserTokenInfo {
  AccessToken: string;
  ExpiresIn: number;
  RefreshToken: string;
  Scope: string;
  TokenType: string;
}

export interface UserTokenInfoResponse {
  access_token: string;
  expire_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
