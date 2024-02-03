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