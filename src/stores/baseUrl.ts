import { ref } from "vue";
import { defineStore } from "pinia";

export const useBaseUrlStore = defineStore(
  "baseUrl",
  () => {
    const baseUrl = ref("http://sxz.api.zykj.org/");
    return { baseUrl };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
