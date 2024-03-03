import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore(
  "userInfo",
  () => {
    const userId = ref(0);
    const accessToken = ref("");
    const expiresAt = ref(0);
    const refreshToken = ref("");
    const refreshExpiresAt = ref(0);
    return { userId, accessToken, expiresAt, refreshToken, refreshExpiresAt };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
