<script setup lang="ts">
import type { Question } from "@/models/GetExamTask";
import DrawboardArea from "./DrawboardArea.vue";
import PhtotosArea from "./PhtotosArea.vue";
import { ref, watch } from "vue";
import Select from "./Select.vue";
import Loading from "@/components/Loading.vue";
import type { GetQuestionViewResult } from "@/models/GetQuestionView";
import { axiosInstance } from "@/request/axiosInstance";
import type { CommonResponse } from "@/models/CommonResponse";

const initialized = ref(false);
const props = defineProps<{
  question: Question;
  examTaskId: number;
  examId: number;
  isShowing: boolean;
  isNoStem: boolean;
}>();

const isLoading = ref(false);
const questionView = ref<GetQuestionViewResult>();
const questionHtml = ref("");
watch(props, async (val) => {
  if (initialized.value) return;
  if (!val.isShowing) return;
  isLoading.value = true;
  const response = (
    await axiosInstance.get(
      `api/services/app/Task/GetQuestionViewAsync?examId=${props.examId}&questionId=${props.question.id}`
    )
  ).data as CommonResponse<GetQuestionViewResult>;
  const result = response.result;
  questionView.value = result;
  const htmlSource = (await axiosInstance.get(`http://sxz.api6.zykj.org${result.path}`)).data;
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(htmlSource, "text/html");
  const html = doc.querySelector(".stem")?.outerHTML;
  if (html == null) {
    questionHtml.value = "无法加载试题题干。";
  } else {
    questionHtml.value = doc.querySelector(".stem")?.outerHTML ?? "无法加载试题题干。";
    initialized.value = true;
  }
  isLoading.value = false;
});
</script>
<template>
  <div v-show="isShowing">
    <div v-html="questionHtml" bg-white text-black dark:invert v-if="!props.isNoStem"></div>
    <!-- 解答题，合并 -->
    <div v-if="questionView?.itemType == 5" class="-m-x-2">
      <PhtotosArea
        v-if="questionView.qstFlows[0].subQuestions != null"
        :uuid="questionView.qstFlows[0].subQuestions[0].uuid"
        :question-id="questionView.id"
        :answer-list="questionView.answerList"
        :initialized="initialized"
      />
      <PhtotosArea
        v-else
        :uuid="questionView.qstFlows[0].uuid"
        :question-id="questionView.id"
        :answer-list="questionView.answerList"
        :initialized="initialized"
      />
    </div>

    <!-- 非解答题，不合并 -->
    <div v-else v-for="qstFlow in questionView?.qstFlows">
      <!-- if no subQs -->
      <div v-if="qstFlow.subQuestions == null || qstFlow.subQuestions.length == 0">
        <Select
          v-if="qstFlow.qstType == 0 || qstFlow.qstType == 2"
          :uuid="qstFlow.uuid"
          :options="qstFlow.options!"
          :answer-list="questionView?.answerList"
          :qst-answers="questionView?.qstAnswers"
          :initialized="initialized"
        />
        <DrawboardArea
          v-else-if="qstFlow.qstType == 4"
          :uuid="qstFlow.uuid"
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
        <Select
          v-if="subQ.qstType == 0 || subQ.qstType == 2"
          :uuid="subQ.uuid"
          :options="subQ.options!"
          :answer-list="questionView?.answerList"
          :qst-answers="questionView?.qstAnswers"
          :initialized="initialized"
        />
        <DrawboardArea
          v-else-if="subQ.qstType == 4"
          :uuid="subQ.uuid"
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
