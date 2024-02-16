<script setup lang="ts">
import type { AnswersToQstFlow } from "@/models/Answers";
import { ref } from "vue";

const props = defineProps<{
  questionId: number;
  uuid: string;
  options: string[];
}>();

const selected = ref<string>();

const getAnswer = (): AnswersToQstFlow => {
  return {
    uuid: props.uuid,
    answers: selected.value ? [selected.value] : [],
  };
};

defineExpose({ getAnswer });
</script>
<template>
  <div grid="~ cols-4 md:cols-5 lg:cols-7" gap-2>
    <div v-for="option in options" flex="~ items-center" h-10>
      <input type="radio" :value="option" :id="uuid + option" v-model:="selected" un-hidden />
      <label
        flex-grow-1
        :for="uuid + option"
        bg="white dark:dark"
        shadow-md
        h-full
        flex="~ items-center justify-center"
        rounded-md
        cursor-pointer
        transition-all
        duration-150
        :class="{
          '!bg-violet-500 !text-white !shadow-violet-300 !dark:shadow-violet-700 !hover:bg-violet !dark:hover:bg-violet-600':
            option == selected,
        }"
        >{{ option }}</label
      >
    </div>
  </div>
</template>
