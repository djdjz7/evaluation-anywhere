<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type LoginRequest, type LoginResponse } from "@/models/Login";
import { type CommonResponse } from "@/models/CommonResponse";
import axios, { type AxiosRequestConfig } from "axios";
import { useUserInfoStore } from "@/stores/userInfo";
import router from "@/router";
import Popup from "@/components/Popup.vue";
import Loading from "@/components/Loading.vue";

const account = ref("");
const password = ref("");

const protocolRef = ref();
const whyRef = ref();

const isLoading = ref(false);

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
    <span text-lg>FIUYRI.</span>
    <div flex="~ justify-center items-center col">
      <h1>Login</h1>
      <input type="text" v-model="account" m-t-2 placeholder="Account" v-on:keyup.enter="login" />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        m-t-2
        v-on:keyup.enter="login"
      />
      <button type="button" m-t-4 @click="login">Login</button>
      <a href="#" color-red no-underline m-t-2 @click="whyRef.show()">
        <div flex="~ items-center justify-center" text-sm>
          <span class="material-symbols-rounded"> info </span>
          <span m-l-1>Why HTTP?</span>
        </div>
      </a>
    </div>
  </div>
  <Popup title="Protocol Error" ref="protocolRef" :can-close="false">
    <p>
      HTTPS is not currently supported by ZY's API, and mixed content is not allowed by modern
      browsers for security reasons.<br />
      Please use HTTP instead.
    </p>
  </Popup>
  <Popup title="Why HTTP?" ref="whyRef">
    <p>
      HTTPS is not currently supported by ZY's API, and mixed content is not allowed by modern
      browsers for security reasons.
    </p>
  </Popup>
  <Loading v-if="isLoading" />
</template>
