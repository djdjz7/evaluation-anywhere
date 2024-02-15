<script setup lang="ts">
import { useRoute } from "vue-router";
import { axiosInstance } from "@/request/axiosInstance";
import { onMounted, ref, watch } from "vue";
import type { CommonResponse } from "@/models/CommonResponse";
import type { GetExamTaskResult, QuestionGroup } from "@/models/GetExamTask";
import { RectangleGroupIcon } from "@heroicons/vue/24/outline";
import type { GetQuestionViewResult } from "@/models/GetQuestionView";
import type { QstFlow } from "@/models/QuestionBase";
const route = useRoute();
const examTaskId = route.params.examTaskId;
const questionGroups = ref<QuestionGroup[]>([]);
const examName = ref("");
const examStartTime = ref("");
let examId = 0;
const currentQuestionId = ref(0);
const questionSrc = ref("");
const currentQstFlows = ref<QstFlow[]>();
watch(currentQuestionId, async (value) => {
  await loadQuestion(value);
});

async function loadQuestion(questionId: number) {
  const response = (
    await axiosInstance.get(
      `api/services/app/Task/GetQuestionViewAsync?examId=${examId}&questionId=${questionId}`
    )
  ).data as CommonResponse<GetQuestionViewResult>;
  const result = response.result;
  currentQstFlows.value = result.qstFlows;
  questionSrc.value = `http://sxz.api6.zykj.org${result.path}`;
}

onMounted(async () => {
  const response = (
    await axiosInstance.get(`api/services/app/Task/GetExamTaskAsync?id=${examTaskId}`)
  ).data as CommonResponse<GetExamTaskResult>;
  const result = response.result;
  questionGroups.value = result.groups;
  examName.value = result.examName;
  examStartTime.value = result.startTime;
  examId = result.examId;
});
</script>
<template>
  <div flex="~ col" h-full flex-grow-1>
    <h1 m-b-0>{{ examName }}</h1>
    <span block m-b-4>{{ examStartTime }}</span>
    <div grid="~ cols-4" flex-grow-1>
      <div w-full rounded="lt-lg lb-lg" un-border="1 solid violet" overflow-auto>
        <div v-for="group in questionGroups" p-2 w-full box-border>
          <div flex="~ items-center" w-full>
            <RectangleGroupIcon class="h-6" />
            <span text-lg font-bold m-l-2>{{ group.name }}</span>
          </div>
          <div
            v-for="question in group.questions"
            un-border-t="1 violet sold"
            @click="currentQuestionId = question.id"
          >
            <span>{{ question.number }}. {{ question.name }}</span>
          </div>
        </div>
      </div>
      <div col-span-3 w-full h-full rounded="rt-lg rb-lg" p-2 box-border>
        <iframe :src="questionSrc"></iframe>
      </div>
    </div>
  </div>
</template>
