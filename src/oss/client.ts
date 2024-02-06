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
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: initialResult.region,
  // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
  accessKeyId: initialResult.accessKeyId,
  accessKeySecret: initialResult.accessKeySecret,
  // 从STS服务获取的安全令牌（SecurityToken）。
  stsToken: initialResult.securityToken,
  refreshSTSToken: async () => {
    // 向您搭建的STS服务获取临时访问凭证。
    const info = await getOssTokenAsync();
    return {
      accessKeyId: info.accessKeyId,
      accessKeySecret: info.accessKeySecret,
      stsToken: info.securityToken,
    };
  },
  // 刷新临时访问凭证的时间间隔，单位为毫秒。
  refreshSTSTokenInterval: 3600000,
  // 填写Bucket名称。
  bucket: initialResult.bucket,
});
