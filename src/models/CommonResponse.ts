export interface CommonResponse<T> {
  result: T;
  targetUrl?: any;
  success: boolean;
  error?: any;
  unAuthorizedRequest: boolean;
  __abp: boolean;
}
