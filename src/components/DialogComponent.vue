<script setup lang="ts">
import { ref } from "vue";

const _title = ref("");
const _contentHtml = ref("");
const _isShowing = ref(false);
let _resolve: (value: void | PromiseLike<void>) => void;

const showDialog = async (title: string, contentHtml: string): Promise<void> => {
  _title.value = title;
  _contentHtml.value = contentHtml;
  _isShowing.value = true;
  return new Promise((resolve, reject) => {
    _resolve = resolve;
  });
};

const closeDialog = () => {
  _isShowing.value = false;
  _resolve();
};

defineExpose({ showDialog });
</script>
<template>
  <div
    fixed
    top-0
    left-0
    w-screen
    h-screen
    flex="~ items-center justify-center"
    v-if="_isShowing"
    @wheel.prevent=""
    @touchmove.prevent=""
    md:backdrop-blur-lg
  >
    <div
      flex="~ col"
      p-4
      bg="[#f9f4ff]"
      dark:bg-dark
      w-full
      h-full
      md:w-auto
      md:h-auto
      md:min-w-100
      md:max-w="70%"
      rounded-lg
      shadow-lg
    >
      <h1 m-y-0>{{ _title }}</h1>
      <div v-html="_contentHtml" flex-grow-1></div>
      <button
        @click="closeDialog"
        self-end
        p-x-4
        p-y-2
        text="white"
        bg="violet-500 hover:violet"
        shadow="md violet-300 dark:violet-700 hover:lg"
        un-border="0"
        rounded-md
        transition-all
        duration-150
      >
        关 闭
      </button>
    </div>
  </div>
</template>
