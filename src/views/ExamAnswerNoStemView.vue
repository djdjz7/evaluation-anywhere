<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { axiosInstance } from "@/request/axiosInstance";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetNoQstExamTaskResult, type QuestionGroup } from "@/models/GetNoQstExamTask";
import Loading from "@/components/Loading.vue";
import AnswerArea from "@/components/AnswerArea.vue";
import type { AnswersToQuestion } from "@/models/Answers";
import { documentWidth } from "@/components/documentWidth";

const isLoading = ref(true);
const route = useRoute();
const router = useRouter();
const examTaskId = route.params.examTaskId;
const examName = ref("");
const examStartTime = ref("");
const questionGroups = ref<QuestionGroup[]>();
const answerAreas = ref<InstanceType<typeof AnswerArea>[] | null>(null);

onMounted(async () => {
  setWindowSize();
  const response = (
    await axiosInstance.get(`api/services/app/Task/GetNoQstExamTaskAsync?id=${examTaskId}`)
  ).data as CommonResponse<GetNoQstExamTaskResult>;
  const task = response.result;
  examName.value = task.examName;
  examStartTime.value = task.startTime;
  questionGroups.value = task.groups;
  isLoading.value = false;
  window.addEventListener("resize", setWindowSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setWindowSize);
});

const setWindowSize = () => {
  documentWidth.value = document.body.clientWidth;
};

async function submit() {
  isLoading.value = true;
  try {
    let allAnswers: AnswersToQuestion[] = [];
    if (answerAreas.value == null) {
      alert("未知错误，请刷新页面后重试。");
      return;
    }
    for (let i = 0; i < answerAreas.value.length; i++) {
      allAnswers.push(await answerAreas.value[i].getAnswerAsync());
    }

    const response = (
      await axiosInstance.post(
        `api/services/app/Task/NoQstExamAnswerAsync?taskId=${examTaskId}`,
        allAnswers
      )
    ).data;
    console.log(response);
    alert("成功");
    router.push({
      path: "/",
      query: {
        needRefresh: "true",
      },
    });
  } catch (e) {
    console.log(e);
    alert("出现异常，请查看控制台输出。");
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div flex="~ col" w-full>
    <h1 m-b-0>{{ examName }}</h1>
    <span block m-b-4>{{ examStartTime }}</span>
    <div v-for="group in questionGroups">
      <h2>{{ group.number }}. {{ group.name }}（共 {{ group.score }} 分）</h2>
      <div v-for="question in group.questions">
        <AnswerArea :question="question" :exam-task-id="Number(examTaskId)" ref="answerAreas" />
      </div>
    </div>
    <button
      @click="submit"
      p-x-4
      p-y-2
      text="white"
      bg="violet-500 hover:violet"
      shadow="md violet-300 dark:violet-700 hover:lg"
      un-border="0"
      rounded-md
      self-center
      transition-all
      duration-150
      m-t-4
      m-b-8
    >
      提 交
    </button>
  </div>
  <Loading v-if="isLoading" />
</template>
