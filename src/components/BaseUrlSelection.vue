<script setup lang="ts">
import { useBaseUrlStore } from "@/stores/baseUrl";

const baseUrlStore = useBaseUrlStore();
</script>
<template>
  <div flex="~ col">
    <div
      p-y-2
      flex="~ items-center"
      cursor-pointer
      transition-all
      duration-150
      class="hover:bg-violet/20"
      rounded-md
    >
      <input
        type="radio"
        id="zy"
        name="baseUrlSelection"
        v-model="baseUrlStore.baseUrl"
        value="http://sxz.api6.zykj.org/"
        hidden
      />
      <div
        w-1
        self-stretch
        :class="{ 'bg-violet': baseUrlStore.baseUrl === 'http://sxz.api6.zykj.org/' }"
        rounded-full
      ></div>
      <label cursor-pointer for="zy" p-l-2>中育服务器直连（需开启“允许不安全内容”）</label>
    </div>

    <div
      flex="~ items-center"
      p-y-2
      m-t-1
      cursor-pointer
      transition-all
      duration-150
      class="hover:bg-violet/20"
      rounded-md
    >
      <input
        type="radio"
        id="proxy"
        name="baseUrlSelection"
        v-model="baseUrlStore.baseUrl"
        value="https://proxy.astrack.me/zykj/"
        hidden
      />
      <div
        w-1
        self-stretch
        :class="{ 'bg-violet': baseUrlStore.baseUrl === 'https://proxy.astrack.me/zykj/' }"
        rounded-full
      ></div>
      <label cursor-pointer for="proxy" p-l-2
        >Astrack Proxy（https 反代） thx
        <a href="https://github.com/Kom3ng" target="_blank">@Astrack</a>!</label
      >
    </div>
  </div>
</template>
