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
  CheckIcon,
  CheckCircleIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/vue/24/outline";
import AnswerAreaWithQuestion from "@/components/readonly/AnswerAreaWithQuestion.vue";
import Loading from "@/components/Loading.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import { documentWidth } from "@/components/documentWidth";

const route = useRoute();
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
const isNoStem = ref(true);
const dialogRef = ref<InstanceType<typeof DialogComponent> | null>(null);
const enableScore = ref(false);
const taskState = ref(0);

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
  isNoStem.value = result.noQstStem;
  enableScore.value = result.enableScore;
  taskState.value = result.state;

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

async function showDescription(title: string, description: string | null) {
  if (Boolean(description)) await dialogRef.value?.showDialog(title, description!);
}
</script>
<template>
  <div flex="~ col" h-screen max-h-full flex-grow-1>
    <div m-x-2>
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

    <span m-x-2 block m-b-4>{{ examStartTime }}</span>
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
            <div flex="~ items-center">
              <span
                flex-grow-1
                flex-shrink-1
                truncate
                transition-all
                duration-150
                m-x-2
                :class="{
                  'm-l-3': currentQuestionId == question.id,
                }"
                >{{ question.number }}. {{ question.name }}</span
              >
              <div flex="~ col items-end" m-r-2>
                <EllipsisHorizontalIcon
                  v-if="
                    taskState == 1 ||
                    (taskState == 4 && question.state == 0 && question.revisingResult == 1)
                  "
                  class="text-violet-500 dark:text-violet-300 h-4"
                />
                <CheckIcon
                  v-else-if="question.state == 1 || question.state == 3"
                  class="text-green-500 dark:text-green-300 h-4"
                />
                <CheckCircleIcon
                  v-else-if="question.revisingResult == 2"
                  class="text-amber-500 dark:text-amber-300 h-4"
                />
                <XMarkIcon v-else class="text-red-500 dark:text-red-300 h-4" />
                <span
                  v-if="
                    taskState == 1 ||
                    (taskState == 4 && question.state == 0 && question.revisingResult == 1)
                  "
                  text-sm
                  text-violet="500 dark:300"
                  >批改中</span
                >
                <span
                  v-else-if="enableScore"
                  text-sm
                  text-red="500 dark:300"
                  :class="[
                    {
                      '!text-green-500 !dark:text-green-300':
                        question.state == 1 || question.state == 3, // don't know what is this,
                    },
                    {
                      '!text-amber-500 !dark:text-amber-300':
                        question.state == 2 && question.revisingResult == 2,
                    },
                  ]"
                  >{{ question.myScore }}/{{ question.score }}</span
                >
              </div>
            </div>

            <div
              transition-all
              duration-150
              h-full
              w-1
              absolute
              top-0
              bg-violet="500 dark:300"
              class="-left-1"
              :class="{
                '!left-0': currentQuestionId == question.id,
              }"
            ></div>
          </div>
        </div>
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
          :is-no-stem="isNoStem"
          :task-state="taskState"
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
