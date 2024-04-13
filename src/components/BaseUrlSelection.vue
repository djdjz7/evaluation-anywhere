<script setup lang="ts">
import { useBaseUrlStore } from "@/stores/baseUrl";

const baseUrlStore = useBaseUrlStore();
</script>
<template>
  <div flex="~ col">
    <div>
      <input
        type="radio"
        id="zy"
        name="baseUrlSelection"
        v-model="baseUrlStore.baseUrl"
        value="http://sxz.api6.zykj.org/"
        hidden
      />

      <label
        cursor-pointer
        for="zy"
        p-y-2
        flex="~ items-center"
        transition-all
        duration-150
        class="hover:bg-violet/20"
        rounded-md
        ><div
          w-1
          self-stretch
          :class="{ 'bg-violet': baseUrlStore.baseUrl === 'http://sxz.api6.zykj.org/' }"
          rounded-full
        ></div>
        <span m-l-2>中育服务器直连（需开启“允许不安全内容”）</span></label
      >
    </div>

    <div>
      <input
        type="radio"
        id="proxy"
        name="baseUrlSelection"
        v-model="baseUrlStore.baseUrl"
        value="https://proxy.astrack.me/zykj/"
        hidden
      />

      <label
        cursor-pointer
        for="proxy"
        flex="~ items-center"
        p-y-2
        m-t-1
        transition-all
        duration-150
        class="hover:bg-violet/20"
        rounded-md
        ><div
          w-1
          self-stretch
          :class="{ 'bg-violet': baseUrlStore.baseUrl === 'https://proxy.astrack.me/zykj/' }"
          rounded-full
        ></div>
        <span m-l-2>Astrack Proxy（https 反代，可能增加延迟）thx </span>
        <a
          no-underline
          text-violet-500
          dark:text-violet-300
          href="https://github.com/Kom3ng"
          target="_blank"
          >@Astrack</a
        >!</label
      >
    </div>
  </div>
</template>
