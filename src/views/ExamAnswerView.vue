<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { axiosInstance } from "@/request/axiosInstance";
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { CommonResponse } from "@/models/CommonResponse";
import { type Question, type GetExamTaskResult, type QuestionGroup } from "@/models/GetExamTask";
import {
  Square3Stack3DIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import AnswerAreaWithQuestion from "@/components/answer/AnswerAreaWithQuestion.vue";
import Loading from "@/components/Loading.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import { documentWidth } from "@/components/documentWidth";
import type { AnswersToQuestion } from "@/models/Answers";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const examTaskId = route.params.examTaskId;
const questionGroups = ref<QuestionGroup[]>([]);
const examName = ref("");
const examStartTime = ref("");
const examId = ref(0);
const currentQuestionId = ref(0);
const allQuestions = ref<Question[]>([]);
const answerAreaContainer = ref<HTMLDivElement | null>(null);
const answerAreas = ref<InstanceType<typeof AnswerAreaWithQuestion>[] | null>(null);
const testDescription = ref("");
const dialogRef = ref<InstanceType<typeof DialogComponent> | null>(null);

onMounted(async () => {
  isLoading.value = true;
  setWindowSize();
  const response = (
    await axiosInstance.get(`api/services/app/Task/GetExamTaskAsync?id=${examTaskId}`)
  ).data as CommonResponse<GetExamTaskResult>;
  const result = response.result;
  questionGroups.value = result.groups;
  examName.value = result.examName;
  examStartTime.value = result.startTime;
  examId.value = result.examId;
  testDescription.value = result.testDescription;

  questionGroups.value.forEach((x) => {
    allQuestions.value = allQuestions.value.concat(x.questions);
  });

  window.addEventListener("resize", setWindowSize);

  isLoading.value = false;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setWindowSize);
});

const setWindowSize = () => {
  if (answerAreaContainer.value == null) return;
  documentWidth.value = answerAreaContainer.value.clientWidth;
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
      const answer = await answerAreas.value[i].getAnswerAsync();
      if (answer != null) allAnswers.push(answer);
    }

    for (let i = 0; i < allAnswers.length; i++) {
      const response = (
        await axiosInstance.post(
          `api/services/app/Task/ExamAnswerAsync?taskId=${examTaskId}`,
          allAnswers[i]
        )
      ).data;
      await delay(1000);
    }

    await axiosInstance.post(
      `api/services/app/Task/CompleteAsync?id=${examTaskId}&isRevising=false`
    );
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

async function delay(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function showDescription(title: string, description: string | null) {
  if (Boolean(description)) await dialogRef.value?.showDialog(title, description!);
}
</script>
<template>
  <div flex="~ col" h-screen max-h-full flex-grow-1>
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
    <div grid="~ cols-4" flex-grow-1 min-h-0 drop-shadow-lg>
      <div
        flex="~ col"
        min-h-0
        overflow-y-auto
        gap-1
        bg-violet-100
        dark:bg-black
        p-1
        rounded="lt-lg"
        box-border
      >
        <div
          flex-shrink-0
          v-for="group in questionGroups"
          box-border
          rounded="lt-md lb-md"
          bg-white
          dark:bg-dark
          shadow-md
          overflow-hidden
        >
          <div flex="~ items-center" w-full m-t-2 p-b-1.5 border-b="black/20 dark:white/30 1 solid">
            <Square3Stack3DIcon class="hidden md:block h-5 min-h-5 m-l-2" />
            <span text-lg font-bold m-l-2 flex-grow-1 truncate text-ellipsis text-nowrap>{{
              group.name
            }}</span>
            <div
              m-r-2
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
              <QuestionMarkCircleIcon class="h-5 min-h-5" />
            </div>
          </div>
          <div
            relative
            transition-all
            duration-150
            v-for="question in group.questions"
            @click="currentQuestionId = question.id"
            p-y-2
            hover:bg="violet/20"
          >
            <span
              transition-all
              duration-150
              m-x-2
              :class="{
                'm-l-3': currentQuestionId == question.id,
              }"
              >{{ question.number }}. {{ question.name }}</span
            >
            <div
              transition-all
              duration-150
              h-full
              w-1
              absolute
              top-0
              bg-violet-500
              class="-left-1"
              :class="{
                '!left-0': currentQuestionId == question.id,
              }"
            ></div>
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
          m-y-2
        >
          提 交
        </button>
      </div>
      <div
        ref="answerAreaContainer"
        col-span-3
        w-full
        h-full
        rounded="rt-lg"
        p-2
        box-border
        overflow-y-auto
        bg="white dark:black"
      >
        <AnswerAreaWithQuestion
          v-for="question in allQuestions"
          :is-showing="currentQuestionId == question.id"
          :question="question"
          :exam-task-id="Number(examTaskId as string)"
          :exam-id="examId"
          ref="answerAreas"
        />
        <div
          v-if="currentQuestionId == 0"
          text-gray-500
          dark:text-gray-300
          w-full
          h-full
          flex="~ col items-center justify-center"
        >
          <PencilSquareIcon class="h-8" />
          <span m-t-2>选择一道题目</span>
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
  <DialogComponent ref="dialogRef" />
</template>
