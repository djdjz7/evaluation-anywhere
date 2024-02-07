export interface GetOssTokenResult {
  strategy: string;
  appId?: any;
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  expiration: string;
}
