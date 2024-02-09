<script setup lang="ts">
import type { AnswersToQstFlow } from "@/models/Answers";
import { ref } from "vue";

const props = defineProps<{
  examTaskId: number;
  questionId: number;
  uuid: string;
  options: string[];
}>();

const selected = ref<string>();

const getAnswers = (): AnswersToQstFlow => {
  return {
    uuid: props.uuid,
    answers: selected.value ? [selected.value] : [],
  };
};

defineExpose({ getAnswers });
</script>
<template>
  <div grid="~ cols-4">
    <div v-for="option in options">
      <input type="radio" :value="option" :id="uuid + option" v-model:="selected" />
      <label :for="uuid + option">{{ option }}</label>
    </div>
  </div>
</template>
