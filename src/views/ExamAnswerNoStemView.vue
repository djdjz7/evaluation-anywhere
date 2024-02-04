<script setup lang="ts">
import { useRoute } from "vue-router";
import axios, { type AxiosRequestConfig } from "axios";

import { useUserInfoStore } from "@/stores/userInfo";
import { onMounted, ref } from "vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetNoQstExamTaskResult, type QuestionGroup } from "@/models/GetNoQstExamTask";

import QuestionArea from "@/components/QuestionArea.vue";

const axiosConfig: AxiosRequestConfig = {
  baseURL: "http://sxz.api6.zykj.org/",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer ".concat(useUserInfoStore().accessToken),
  },
};
const route = useRoute();
const examTaskId = route.params.examTaskId;
const examName = ref("");
const questionGroups = ref<QuestionGroup[]>();

onMounted(async () => {
  const response = (
    await axios.get(`api/services/app/Task/GetNoQstExamTaskAsync?id=${examTaskId}`, axiosConfig)
  ).data as CommonResponse<GetNoQstExamTaskResult>;
  const task = response.result;
  examName.value = task.examName;
  questionGroups.value = task.groups;
});

</script>
<template>
  <span block>ExamAnswerNoStem</span>
  <h1>{{ examName }}</h1>
  <div v-for="group in questionGroups">
    <h2>{{ group.number }}. {{ group.name }}（共 {{ group.score }} 分）</h2>
    <div v-for="question in group.questions">
      <QuestionArea :question="question" />
    </div>
  </div>
</template>
