import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import type { CommonResponse } from "@/models/CommonResponse";
import type { LoginRequest, LoginResponse, RefreshTokenResult } from "@/models/Login";
import { useRouter } from "vue-router";

export const axiosInstance = axios.create({
  baseURL: "http://sxz.api6.zykj.org/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const userInfo = useUserInfoStore();
  let timeNow = Date.now();
  if (timeNow < userInfo.expiresAt) {
    config.headers.setAuthorization(`Bearer ${userInfo.accessToken}`, true);
    return config;
  }
  if (timeNow < userInfo.refreshExpiresAt) {
    console.log("刷新 token...");
    const refreshTokenResponse = (
      await axios.post("http://sxz.api6.zykj.org/api/TokenAuth/RefreshToken", null, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
          RefreshToken: userInfo.refreshToken,
        },
      })
    ).data as CommonResponse<RefreshTokenResult>;
    const refreshTokenResult = refreshTokenResponse.result;
    timeNow = Date.now();
    userInfo.$patch({
      accessToken: refreshTokenResult.accessToken,
      expiresAt: timeNow + refreshTokenResult.expireInSeconds * 1000,
      refreshToken: refreshTokenResult.refreshToken,
      refreshExpiresAt: timeNow + refreshTokenResult.refreshExpireInSeconds * 1000,
    });
    config.headers.setAuthorization(`Bearer ${refreshTokenResult.accessToken}`, true);
    return config;
  }

  console.log("重新登录...");
  const loginResponse = await axios.post(
    "http://sxz.api6.zykj.org/api/TokenAuth/Login",
    {
      userName: userInfo.userName,
      password: userInfo.password,
      clientType: 1,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const loginData = loginResponse.data as CommonResponse<LoginResponse>;
  var loginResult = loginData.result as LoginResponse;
  timeNow = Date.now();
  useUserInfoStore().$patch({
    accessToken: loginResult.accessToken,
    expiresAt: timeNow + loginResult.expireInSeconds * 1000,
    refreshToken: loginResult.refreshToken,
    refreshExpiresAt: timeNow + loginResult.refreshExpireInSeconds * 1000,
  });
  config.headers.setAuthorization(`Bearer ${loginResult.accessToken}`, true);
  return config;
});
