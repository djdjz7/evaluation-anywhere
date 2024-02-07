export interface LoginRequest {
  userName: string;
  password: string;
  clientType: number;
}

export interface LoginResponse {
  clientCode: string;
  accessToken: string;
  rongCloudToken: any;
  expireInSeconds: number;
  userId: number;
  roleType: number;
  mobile: any;
  needChangePwd: boolean;
  refreshToken: string;
  refreshExpireInSeconds: number;
  needSmsVerification: boolean;
}

export interface RefreshTokenResult {
  accessToken: string;
  expireInSeconds: number;
  refreshToken: string;
  refreshExpireInSeconds: number;
}

export interface GetInfoResult {
  id: number;
  userName: string;
  realName: string;
  surname: string;
  name: string;
  mobile?: any;
  email?: any;
  photo: string | null;
  roles: number[];
}
