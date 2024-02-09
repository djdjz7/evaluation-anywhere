<script setup lang="ts">
import { useRoute } from "vue-router";
import { axiosInstance } from "@/request/axiosInstance";
import { onMounted, ref } from "vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetNoQstExamTaskResult, type QuestionGroup } from "@/models/GetNoQstExamTask";

import AnswerArea from "@/components/AnswerArea.vue";
import type { AnswersToQuestion } from "@/models/Answers";

const route = useRoute();
const examTaskId = route.params.examTaskId;
const examName = ref("");
const questionGroups = ref<QuestionGroup[]>();
const answerAreas = ref<InstanceType<typeof AnswerArea>[] | null>(null);

onMounted(async () => {
  const response = (
    await axiosInstance.get(`api/services/app/Task/GetNoQstExamTaskAsync?id=${examTaskId}`)
  ).data as CommonResponse<GetNoQstExamTaskResult>;
  const task = response.result;
  examName.value = task.examName;
  questionGroups.value = task.groups;
});

async function submit() {
  let allAnswers: AnswersToQuestion[] = [];
  if (answerAreas.value == null) {
    alert("未知错误，请刷新页面后重试。");
    return;
  }
  for (let i = 0; i < answerAreas.value.length; i++) {
    allAnswers.push(await answerAreas.value[i].getAnswerAsync());
  }
  console.log(allAnswers);
}
</script>
<template>
  <span block>ExamAnswerNoStem</span>
  <h1>{{ examName }}</h1>
  <div v-for="group in questionGroups">
    <h2>{{ group.number }}. {{ group.name }}（共 {{ group.score }} 分）</h2>
    <div v-for="question in group.questions">
      <AnswerArea :question="question" :exam-task-id="Number(examTaskId)" ref="answerAreas" />
    </div>
  </div>
  <button @click="submit">提交</button>
</template>
