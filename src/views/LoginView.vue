<script setup lang="ts">
import { onMounted, ref } from "vue";
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import { type LoginRequest, type LoginResponse } from "@/models/Login";
import { type CommonResponse } from "@/models/CommonResponse";
import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import { useRouter } from "vue-router";
import Popup from "@/components/Popup.vue";
import Loading from "@/components/Loading.vue";

const account = ref("");
const password = ref("");

const protocolRef = ref();
const whyRef = ref();

const isLoading = ref(false);

const router = useRouter();

onMounted(() => {
  if (document.location.protocol.toLowerCase() == "https:") {
    protocolRef.value.show();
  }
});

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
      baseURL: "http://sxz.api6.zykj.org/",
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
    alert(e);
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
      <button
        type="button"
        m-t-4
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
      <a href="#" color-red no-underline m-t-2 @click="whyRef.show()">
        <div flex="~ items-center justify-center" text-sm>
          <InformationCircleIcon class="h-5" />
          <span m-l-1>为何使用 HTTP？</span>
        </div>
      </a>
    </div>
  </div>
  <Popup title="协议错误" ref="protocolRef" :can-close="false">
    <p>
      中育目前并不支持 HTTPS 内容，并且混合协议的请求已在主流浏览器上出于安全目的禁用。<br />
      请使用 HTTP。
    </p>
  </Popup>
  <Popup title="为何使用 HTTP？" ref="whyRef">
    <p>中育目前并不支持 HTTPS 内容，并且混合协议的请求已在主流浏览器上出于安全目的禁用。</p>
  </Popup>
  <Loading v-if="isLoading" />
</template>

<style scoped>
input[type="text"],
input[type="password"],
input[type="file"] {
  font-family: Inter;
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
