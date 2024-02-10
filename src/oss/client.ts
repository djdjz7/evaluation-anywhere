import OSS from "ali-oss";
import { axiosInstance } from "@/request/axiosInstance";
import type { GetOssTokenResult } from "@/models/OSS";
import type { CommonResponse } from "@/models/CommonResponse";

function getOssTokenAsync(): Promise<GetOssTokenResult> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = (await axiosInstance.get(
        "api/services/app/ObjectStorage/GeneratorTokenAsync"
      )) as CommonResponse<GetOssTokenResult>;
      const result = response.result;
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}

const initialResult = await getOssTokenAsync();

export const ossClient = new OSS({
  region: initialResult.region,
  accessKeyId: initialResult.accessKeyId,
  accessKeySecret: initialResult.accessKeySecret,
  stsToken: initialResult.securityToken,
  refreshSTSToken: async () => {
    const info = await getOssTokenAsync();
    return {
      accessKeyId: info.accessKeyId,
      accessKeySecret: info.accessKeySecret,
      stsToken: info.securityToken,
    };
  },
  refreshSTSTokenInterval: 3600000,
  bucket: initialResult.bucket,
});
