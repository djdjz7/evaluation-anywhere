<script setup lang="ts">
import { onMounted, ref } from "vue";
import { InformationCircleIcon, Cog6ToothIcon } from "@heroicons/vue/24/outline";
import { type LoginRequest, type LoginResponse } from "@/models/Login";
import { type CommonResponse } from "@/models/CommonResponse";
import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import { useRouter } from "vue-router";
import Popup from "@/components/Popup.vue";
import Loading from "@/components/Loading.vue";
import BaseUrlSelection from "@/components/BaseUrlSelection.vue";
import { useBaseUrlStore } from "@/stores/baseUrl";

const account = ref("");
const password = ref("");

const protocolRef = ref();
const baseUrlPopup = ref<InstanceType<typeof Popup> | null>(null);

const isLoading = ref(false);

const router = useRouter();

async function login() {
  isLoading.value = true;
  try {
    if (account.value == "") {
      alert("Account could not be empty.");
      return;
    }
    if (password.value == "") {
      alert("Password could not be empty.");
      return;
    }

    var loginRequest: LoginRequest = {
      userName: account.value,
      password: password.value,
      clientType: 1,
    };

    var config: AxiosRequestConfig = {
      baseURL: useBaseUrlStore().baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    };

    var loginResponse = await axios.post(
      "api/TokenAuth/Login",
      JSON.stringify(loginRequest),
      config
    );
    var loginData = loginResponse.data as CommonResponse<LoginResponse>;
    if (!loginData.success) {
      alert(loginData.error.details + "\n" + loginData.error.message);
      return;
    }
    var loginResult = loginData.result as LoginResponse;
    const timeNow = Date.now();
    useUserInfoStore().$patch({
      userId: loginResult.userId,
      accessToken: loginResult.accessToken,
      expiresAt: timeNow + loginResult.expireInSeconds * 1000,
      refreshToken: loginResult.refreshToken,
      refreshExpiresAt: timeNow + loginResult.refreshExpireInSeconds * 1000,
    });

    router.push({
      path: "/",
      query: {
        needRefresh: "true",
      },
    });
  } catch (e) {
    console.log(e);
    if (JSON.stringify(e).includes("Network Error")) protocolRef.value.show();
    else alert(e);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div absolute top-0 bottom-0 left-0 right-0 flex="~ justify-center items-center col">
    <span text-lg>Evaluation Anywhere</span>
    <div flex="~ justify-center items-center col">
      <h1>登录</h1>
      <input type="text" v-model="account" placeholder="账号" v-on:keyup.enter="login" />
      <input type="password" v-model="password" placeholder="密码" m-t-2 v-on:keyup.enter="login" />
      <div flex="~ items-center justify-center" m-t-4>
        <button
          type="button"
          shadow-md
          bg-violet-500
          hover:bg-violet
          focus:bg-violet
          focus:outline-none
          text-white
          shadow-violet="300 dark:700"
          hover:shadow-lg
          focus:shadow-lg
          p-x-4
          p-y-2
          border-0
          rounded-md
          transition-all
          duration-150
          @click="login"
        >
          登 录
        </button>
        <div
          p-1
          m-l-2
          rounded-md
          transition-all
          duration-150
          class="cursor-pointer hover:bg-violet/20"
          flex="~ items-center"
        >
          <Cog6ToothIcon @click="baseUrlPopup?.show()" class="h-5 color-violet" />
          
        </div>
      </div>
    </div>
  </div>
  <Popup title="协议错误" ref="protocolRef">
    <p>
      中育目前并不支持 HTTPS 内容，并且混合协议的请求已在主流浏览器上出于安全目的默认禁用。<br />
      请使用 HTTP，或者在浏览器网站权限设置中允许 ea.djdjz7.top 访问不安全的内容。<br/>
      <strong>若无法采用以上方式：</strong>在设置中切换 BaseURL 到 Astrack Proxy 以使用 HTTPS 直接连接。（可能增加延迟）
    </p>
  </Popup>
  <Loading v-if="isLoading" />

  <Popup title="设置" ref="baseUrlPopup">
    <h2>BaseURL 设置</h2>
    <BaseUrlSelection />
  </Popup>
</template>

<style scoped>
input[type="text"],
input[type="password"],
input[type="file"] {
  font-family: inherit;
  @apply p-y-2 p-x-3 border-1 border-solid border-violet/40 rounded-2 dark:bg-dark;
  @apply transition-all duration-200;
  @apply focus:ring-2 ring-offset-1 ring-violet/50;
  @apply text-dark dark:text-light;
  @apply hover:shadow-md;
}
input[type="text"]:focus,
input[type="password"]:focus,
input[type="file"]:focus {
  outline: none;
}
</style>
