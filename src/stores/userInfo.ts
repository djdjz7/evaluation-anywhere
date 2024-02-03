import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore("userInfo", () => {
  const userName = ref("");
  const password = ref("");
  const accessToken = ref("");
  return { userName, password, accessToken };
});
