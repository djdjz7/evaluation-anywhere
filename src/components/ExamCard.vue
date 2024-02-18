<script setup lang="ts">
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import { StarIcon, BellAlertIcon } from "@heroicons/vue/20/solid";
import { useRouter } from "vue-router";

import { type Exam } from "@/models/GetStudentTaskListResult";
import { axiosInstance } from "@/request/axiosInstance";
import type { CommonResponse } from "@/models/CommonResponse";
import { onMounted, ref } from "vue";

const props = defineProps<{
  exam: Exam;
}>();

const router = useRouter();
const isCollect = ref();

onMounted(() => {
  isCollect.value = props.exam.isCollect;
});

function navigateToExam(exam: Exam) {
  var path: string;
  if (exam.examState == 0) {
    if (exam.taskState == 0) {
      if (exam.isNoStem) {
        path = `/exam/${exam.examTaskId}/answerNoStem`;
      } else {
        path = `/exam/${exam.examTaskId}/answer`;
      }
    } else if (exam.taskState == 3) {
      path = `/exam/${exam.examTaskId}/revise`;
    } else {
      path = `/exam/${exam.examTaskId}/details`;
    }
  } else {
    path = `/exam/${exam.examTaskId}/details`;
  }
  router.push({
    path,
  });
}

async function updateCollectStatus() {
  let response = (
    await axiosInstance.post("api/services/app/Task/SetExamTaskCollectAsync", {
      examTaskId: props.exam.examTaskId,
      isCollect: !props.exam.isCollect,
    })
  ).data as CommonResponse<any>;
  if (response.success) {
    isCollect.value = !props.exam.isCollect;
    props.exam.isCollect = !props.exam.isCollect;
  }
}
</script>
<template>
  <div
    @click="navigateToExam(props.exam)"
    class="group"
    flex="~ row items-center"
    :class="[
      'bg-white',
      {
        '!bg-amber-100 !dark:bg-amber-950 border-amber dark:border-amber-600 border-solid border-1 !shadow-amber-300/60 !dark:shadow-amber-800/60':
          props.exam.taskState === 3,
      },
    ]"
    dark:bg-dark-200
    shadow-md
    hover:shadow-lg
    min-h-25
    transition-all
    duration-200
    text-start
    p-3
    text-nowrap
    rounded-lg
    relative
  >
    <div truncate flex="~ col" flex-grow-1>
      <div flex="~ items-center">
        <span block truncate font-bold text-lg>{{ props.exam.examName }}</span>
        <span
          v-if="props.exam.isExempted"
          text-sm
          m-l-2
          bg-green-500
          dark:bg-green
          w-2
          flex-shrink-0
          h-2
          rounded-full
        ></span>
        <span
          v-if="props.exam.isRead === false"
          text-sm
          m-l-2
          bg-red-500
          dark:bg-red
          w-2
          flex-shrink-0
          h-2
          rounded-full
        ></span>
      </div>
      <div flex="~ col" flex-grow-1>
        <div flex="~">
          <div
            dark:bg-violet-300
            w-.6
            m-r-1
            h-auto
            rounded-full
            :class="[
              'bg-violet-500',
              { '!bg-amber-700 !dark:bg-amber-300': props.exam.taskState === 3 },
            ]"
          ></div>
          <span
            dark:text-violet-300
            rounded-sm
            text-sm
            w-fit
            :class="[
              'text-violet-500',
              { '!text-amber-700 !dark:text-amber-300': props.exam.taskState === 3 },
            ]"
            >{{ props.exam.topicName }}</span
          >
        </div>
        <span block text-sm text-gray-600 dark:text-gray-300>{{ props.exam.startTime }}</span>
        <div flex="~ items-center" m-t-1>
          <div flex="~ items-center" @click.stop="updateCollectStatus" cursor-pointer>
            <StarIcon class="text-gray h-4" :class="{ 'text-yellow': isCollect }" />
            <span m-l-1 text-sm>{{ isCollect ? "已收藏" : "收藏" }}</span>
          </div>
          <span
            text-red
            m-l-2
            v-if="
              props.exam.taskState == 0 &&
              props.exam.examState == 0 &&
              props.exam.answeringUrge != 0
            "
            text-sm
            flex="~ items-center"
          >
            <BellAlertIcon class="h-4 m-r-1" />
            {{ props.exam.answeringUrge }}
          </span>
        </div>

        <div text-red>
          <span
            v-if="
              props.exam.taskState == 3 && props.exam.examState == 0 && props.exam.revisingUrge != 0
            "
            text-sm
            flex="~ items-center"
          >
            <BellAlertIcon class="h-4 m-r-1" />
            {{ props.exam.revisingUrge }}
          </span>
        </div>
      </div>
    </div>
    <div flex="~ items-center" transition-transform duration-200 group-hover:translate-x-1>
      <ChevronRightIcon class="h-5 color-gray" />
    </div>
  </div>
</template>
