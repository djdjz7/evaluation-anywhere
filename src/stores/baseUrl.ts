import { ref } from "vue";
import { defineStore } from "pinia";

export const useBaseUrlStore = defineStore(
  "baseUrl",
  () => {
    const baseUrl = ref("http://sxz.api6.zykj.org/");
    return { baseUrl };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
