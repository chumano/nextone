export interface JWTDecodeInfo {
  exp: number;
  iss: string;
  auth: string[];
  client_id: string;
  sub: string;
  auth_time: number;
  idp: string;
  role: string;
  ApplicationSystem: string;
  jti: string;
  iat: number;
  scope: string[];
  amr: string[];
}
