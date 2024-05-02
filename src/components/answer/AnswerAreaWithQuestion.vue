<script setup lang="ts">
import type { Question } from "@/models/GetExamTask";
import DrawboardArea from "./DrawboardArea.vue";
import PhtotosArea from "./PhtotosArea.vue";
import { type AnswersToQstFlow, type AnswersToQuestion } from "@/models/Answers";
import { ref, watch } from "vue";
import SingleSelect from "./SingleSelect.vue";
import MultiSelect from "./MultiSelect.vue";
import Loading from "@/components/Loading.vue";
import type { GetQuestionViewResult } from "@/models/GetQuestionView";
import { axiosInstance } from "@/request/axiosInstance";
import type { CommonResponse } from "@/models/CommonResponse";

let initialized = false;
const props = defineProps<{
  question: Question;
  examTaskId: number;
  examId: number;
  isShowing: boolean;
}>();

const isLoading = ref(false);
const questionView = ref<GetQuestionViewResult>();
const drawboardRefs = ref<InstanceType<typeof DrawboardArea>[] | null>(null);
const singleSelectRefs = ref<InstanceType<typeof SingleSelect>[] | null>(null);
const multiSelectRefs = ref<InstanceType<typeof MultiSelect>[] | null>(null);
const photoAreaRef = ref<InstanceType<typeof PhtotosArea> | null>(null);
const questionHtml = ref("");
watch(props, async (val) => {
  if (initialized) return;
  if (!val.isShowing) return;
  isLoading.value = true;
  const response = (
    await axiosInstance.get(
      `api/services/app/Task/GetQuestionViewAsync?examId=${props.examId}&questionId=${props.question.id}`
    )
  ).data as CommonResponse<GetQuestionViewResult>;
  const result = response.result;
  questionView.value = result;
  const htmlSource = (await axiosInstance.get(`http://sxz.api.zykj.org${result.path}`)).data;
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(htmlSource, "text/html");
  const html = doc.querySelector(".stem")?.outerHTML;
  if (html == null) {
    questionHtml.value = "无法加载试题题干。";
  } else {
    questionHtml.value = doc.querySelector(".stem")?.outerHTML ?? "无法加载试题题干。";
    initialized = true;
  }
  isLoading.value = false;
});

const getAnswerAsync = async (): Promise<AnswersToQuestion | null> => {
  if (!initialized || questionView.value == null) {
    return null;
  }
  const answers: AnswersToQstFlow[] = [];
  if (questionView?.value.itemType == 5) {
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
  <div v-show="isShowing">
    <div v-html="questionHtml" bg-white text-black dark:invert></div>
    <!-- 解答题，合并 -->
    <div v-if="questionView?.itemType == 5" class="-m-x-2">
      <PhtotosArea
        v-if="questionView.qstFlows[0].subQuestions != null"
        :exam-task-id="examTaskId"
        :uuid="questionView.qstFlows[0].subQuestions[0].uuid"
        :question-id="questionView.id"
        ref="photoAreaRef"
      />
      <PhtotosArea
        v-else
        :exam-task-id="examTaskId"
        :uuid="questionView.qstFlows[0].uuid"
        :question-id="questionView.id"
        ref="photoAreaRef"
      />
    </div>

    <!-- 非解答题，不合并 -->
    <div v-else v-for="qstFlow in questionView?.qstFlows">
      <!-- if no subQs -->
      <div v-if="qstFlow.subQuestions == null || qstFlow.subQuestions.length == 0">
        <SingleSelect
          v-if="qstFlow.qstType == 0"
          :exam-task-id="examTaskId"
          :uuid="qstFlow.uuid"
          :question-id="questionView!.id"
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

        <div
          v-else
          bg-red-100
          p-4
          un-border="~ red 1 solid"
          rounded-xl
          flex="~ col items-center"
          text-red
        >
          <span block font-bold>未知的问题类型</span>
          <span block text-sm>qstFlow.qstType: {{ qstFlow.qstType }}</span>
          <a un-text="sm red" block href="https://github.com/djdjz7/evaluation-anywhere/issues"
            >报告此问题</a
          >
        </div>
      </div>

      <!-- if has subQs -->
      <div v-else v-for="subQ in qstFlow.subQuestions">
        <SingleSelect
          v-if="subQ.qstType == 0"
          :exam-task-id="examTaskId"
          :uuid="subQ.uuid"
          :question-id="question.id"
          :options="subQ.options!"
          ref="singleSelectRefs"
        />
        <MultiSelect
          v-else-if="subQ.qstType == 2"
          :exam-task-id="examTaskId"
          :uuid="subQ.uuid"
          :question-id="question.id"
          :options="subQ.options!"
          ref="multiSelectRefs"
        />
        <DrawboardArea
          v-else-if="subQ.qstType == 4"
          :uuid="subQ.uuid"
          ref="drawboardRefs"
          :question-id="question.id"
          :exam-task-id="examTaskId"
        />

        <div
          v-else
          bg-red-100
          p-4
          un-border="~ red 1 solid"
          rounded-xl
          flex="~ col items-center"
          text-red
        >
          <span block font-bold>未知的问题类型</span>
          <span block text-sm>qstFlow.qstType: {{ subQ.qstType }}</span>
          <a un-text="sm red" block href="https://github.com/djdjz7/evaluation-anywhere/issues"
            >报告此问题</a
          >
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>
