import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    const accessToken = ref("");
    const expiresAt = ref(0);
    const refreshToken = ref("");
    const refreshExpiresAt = ref(0);
    return { accessToken, expiresAt, refreshToken, refreshExpiresAt };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
