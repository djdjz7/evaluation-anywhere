import axios from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import { useBaseUrlStore } from "@/stores/baseUrl";
import type { CommonResponse } from "@/models/CommonResponse";
import type { RefreshTokenResult } from "@/models/Login";
import router from "@/router";

const baseURLStore = useBaseUrlStore();

export const axiosInstance = axios.create({
  baseURL: baseURLStore.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  config.baseURL = baseURLStore.baseUrl;
  const userInfo = useUserInfoStore();
  let timeNow = Date.now();
  if (timeNow < userInfo.expiresAt) {
    config.headers.setAuthorization(`Bearer ${userInfo.accessToken}`, true);
    return config;
  }
  if (timeNow < userInfo.refreshExpiresAt) {
    console.log("刷新 token...");
    const refreshTokenResponse = (
      await axios.post("http://sxz.api.zykj.org/api/TokenAuth/RefreshToken", null, {
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

  router.push("/login");
  alert("登录信息已过期");
  throw new Error("登录信息已过期");
});
