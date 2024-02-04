import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    const userName = ref("");
    const password = ref("");
    const accessToken = ref("");
    const expiresAt = ref(0);
    const refreshToken = ref("");
    const refreshExpiresAt = ref(0);
    return { userName, password, accessToken, expiresAt, refreshToken, refreshExpiresAt };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
