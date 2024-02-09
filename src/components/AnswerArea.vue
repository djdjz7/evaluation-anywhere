<script setup lang="ts">
import type { Question } from "@/models/GetNoQstExamTask";
import DrawboardArea from "./DrawboardArea.vue";
import PhtotosArea from "./PhtotosArea.vue";
import { type AnswersToQstFlow, type AnswersToQuestion } from "@/models/Answers";
import { ref } from "vue";
import SingleSelect from "@/components/SingleSelect.vue";
import MultiSelect from "@/components/MultiSelect.vue";

const props = defineProps<{
  question: Question;
  examTaskId: number;
}>();
const drawboardRefs = ref<InstanceType<typeof DrawboardArea>[] | null>(null);
const singleSelectRefs = ref<InstanceType<typeof SingleSelect>[] | null>(null);
const multiSelectRefs = ref<InstanceType<typeof MultiSelect>[] | null>(null);
const photoAreaRef = ref<InstanceType<typeof PhtotosArea> | null>(null);

const getAnswerAsync = async (): Promise<AnswersToQuestion> => {
  const answers: AnswersToQstFlow[] = [];

  if (props.question.qstFlows[0].qstType == 3) {
    let qstAnswer = await photoAreaRef.value?.getQstAnswerAsync();
    if (qstAnswer != undefined) answers.push(qstAnswer);
  } else {
    singleSelectRefs.value?.forEach((ref) => {
      answers.push(ref.getAnswer());
    });
    multiSelectRefs.value?.forEach((ref) => {
      answers.push(ref.getAnswer());
    });
    if (drawboardRefs.value != null) {
      for (let i = 0; i < drawboardRefs.value.length; i++) {
        answers.push(await drawboardRefs.value[i].getQstAnswerAsync());
      }
    }
  }
  return {
    draft: "",
    questionId: props.question.id,
    answers,
  };
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
      ref="photoAreaRef"
    />
  </div>

  <!-- 非解答题，不合并 -->
  <div v-else v-for="qstFlow in question.qstFlows">
    <!-- if no subQs -->
    <div v-if="qstFlow.subQuestions == null || qstFlow.subQuestions.length == 0">
      <span>{{ qstFlow.qstType }}</span>

      <!-- single select -->
      <!-- <RadioGroup v-if="qstFlow.qstType == 0">
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
      </RadioGroup> -->
      <SingleSelect
        v-if="qstFlow.qstType == 0"
        :exam-task-id="examTaskId"
        :uuid="qstFlow.uuid"
        :question-id="question.id"
        :options="qstFlow.options!"
        ref="singleSelectRefs"
      />
      <MultiSelect
        v-else-if="qstFlow.qstType == 2"
        :exam-task-id="examTaskId"
        :uuid="qstFlow.uuid"
        :question-id="question.id"
        :options="qstFlow.options!"
        ref="multiSelectRefs"
      />

      <DrawboardArea
        v-else-if="qstFlow.qstType == 4"
        :uuid="qstFlow.uuid"
        ref="drawboardRefs"
        :question-id="question.id"
        :exam-task-id="examTaskId"
      />

      <div v-else bg-red-100 p-4 un-border="~ red 1 solid" rounded-xl flex="~ col items-center" text-red>
        <span block font-bold>未知的问题类型</span>
        <span block text-sm>qstFlow.qstType: {{ qstFlow.qstType }}</span>
        <a un-text="sm red" block href="https://github.com/djdjz7/evaluation-anywhere/issues">报告此问题</a>
      </div>
    </div>

    <!-- if has subQs -->
    <div v-else></div>
  </div>
</template>
