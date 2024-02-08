<script setup lang="ts">
import type { Question } from "@/models/GetNoQstExamTask";
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import DrawboardArea from "./DrawboardArea.vue";
import PhtotosArea from "./PhtotosArea.vue";
import { type AnswersToQuestion } from "@/models/Answers";
import { ref } from "vue";

defineProps<{
  question: Question;
  examTaskId: number;
}>();
const singleDrawboardRef = ref<InstanceType<typeof DrawboardArea> | null>(null);
const getAnswerAsync = (): Promise<AnswersToQuestion> => {
  return new Promise((resolve, reject) => {});
};

defineExpose({ getAnswerAsync });
</script>
<template>
  <h3>{{ question.number }}. {{ question.name }}</h3>
  <!-- 解答题，合并 -->
  <div v-if="question.qstFlows[0].qstType == 3">
    <PhtotosArea
      :exam-task-id="examTaskId"
      :uuid="question.qstFlows[0].uuid"
      :question-id="question.id"
    />
  </div>

  <!-- 非解答题，不合并 -->
  <div v-else v-for="qstFlow in question.qstFlows">
    <!-- if no subQs -->
    <div v-if="Boolean(qstFlow.subQuestions?.length != 0)">
      <span>{{ qstFlow.qstType }}</span>

      <!-- single select -->
      <RadioGroup v-if="qstFlow.qstType == 0">
        <div class="gap-x-2" grid grid-cols-4>
          <RadioGroupOption
            as="template"
            v-for="option in qstFlow.options"
            :key="option"
            :value="option"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active ? 'ring-2 ring-blue-700/60' : '',
                checked ? 'bg-blue-500 text-white shadow-blue-700/40' : 'bg-white ',
              ]"
              class="relative flex justify-center cursor-pointer rounded-md px-5 py-4 shadow-md focus:outline-none"
            >
              <span :class="checked ? 'text-white' : 'text-gray-900'" class="font-medium">
                {{ option }}
              </span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <DrawboardArea
        v-if="qstFlow.qstType == 4"
        :uuid="qstFlow.uuid"
        ref="singleDrawboardRef"
        :question-id="question.id"
        :exam-task-id="examTaskId"
      />
    </div>

    <!-- if has subQs -->
    <div v-else></div>
  </div>
</template>
