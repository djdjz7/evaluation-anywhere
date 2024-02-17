<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { axiosInstance } from "@/request/axiosInstance";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { type CommonResponse } from "@/models/CommonResponse";
import { type GetNoQstExamTaskResult, type QuestionGroup } from "@/models/GetNoQstExamTask";
import Loading from "@/components/Loading.vue";
import AnswerArea from "@/components/AnswerArea.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import type { AnswersToQuestion } from "@/models/Answers";
import { documentWidth } from "@/components/documentWidth";

const isLoading = ref(true);
const route = useRoute();
const router = useRouter();
const examTaskId = route.params.examTaskId;
const examName = ref("");
const examStartTime = ref("");
const testDescription = ref("");
const questionGroups = ref<QuestionGroup[]>();
const answerAreas = ref<InstanceType<typeof AnswerArea>[] | null>(null);
const dialogRef = ref<InstanceType<typeof DialogComponent> | null>(null);

onMounted(async () => {
  setWindowSize();
  const response = (
    await axiosInstance.get(`api/services/app/Task/GetNoQstExamTaskAsync?id=${examTaskId}`)
  ).data as CommonResponse<GetNoQstExamTaskResult>;
  const task = response.result;
  examName.value = task.examName;
  examStartTime.value = task.startTime;
  testDescription.value = task.testDescription;
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

async function showDescription(title: string, description: string) {
  if (Boolean(description)) await dialogRef.value?.showDialog(title, description);
}
</script>
<template>
  <div flex="~ col" m-x-2>
    <div>
      <h1 m-b-0 inline align-middle>{{ examName }}</h1>
      <div
        inline-flex
        m-l-2
        text-violet-500
        dark:text-violet-300
        rounded-full
        p-1
        cursor-pointer
        transition-all
        duration-150
        hover:bg="violet-500/20 dark:violet-300/30"
        shadow="violet/20"
        hover:shadow-md
        align-middle
        v-if="Boolean(testDescription)"
        @click="showDescription('试卷说明', testDescription)"
      >
        <QuestionMarkCircleIcon class="h-8" />
      </div>
    </div>
    <span block m-b-4>{{ examStartTime }}</span>
    <div v-for="group in questionGroups">
      <div flex="~ items-center">
        <h2 truncate flex-shrink-1>
          {{ group.number }}. {{ group.name }}（共 {{ group.score }} 分）
        </h2>
        <div
          text-violet-500
          dark:text-violet-300
          rounded-full
          p-1
          cursor-pointer
          transition-all
          duration-150
          hover:bg="violet-500/20 dark:violet-300/30"
          shadow="violet/20"
          hover:shadow-md
          flex="~ items-center"
          v-if="Boolean(group.description)"
          :title="group.description"
          @click="showDescription('大题说明', group.description)"
        >
          <QuestionMarkCircleIcon class="h-7" />
        </div>
      </div>
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
  <DialogComponent ref="dialogRef" />
</template>
