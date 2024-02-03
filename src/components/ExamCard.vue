<script setup lang="ts">
import { ChevronRightIcon, BellAlertIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

import { type Exam } from "@/model/GetStudentTaskListResult";

const props = defineProps<{
  exam: Exam;
}>();

const router = useRouter();

function navigateToExam(exam: Exam) {
  router.push({
    path: `/exam/${exam.examId}`,
    query: {
      taskState: exam.taskState,
      examState: exam.examState,
      isNoStem: exam.isNoStem.toString(),
    },
  });
}
</script>
<template>
  <div
    @click="navigateToExam(props.exam)"
    class="group"
    flex="~ row"
    :class="[
      'bg-white',
      { '!bg-amber-100 border-amber border-solid border-1': props.exam.taskState === 3 },
    ]"
    dark:bg-dark
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
      </div>
      <div flex="~ col" flex-grow-1>
        <div flex="~">
          <div
            dark:bg-blue-300
            w-.6
            m-r-1
            h-auto
            rounded-full
            :class="['bg-blue-600', { '!bg-amber-700': props.exam.taskState === 3 }]"
          ></div>
          <span
            dark:text-blue-300
            rounded-sm
            text-sm
            w-fit
            :class="['text-blue-600', { '!text-amber-700': props.exam.taskState === 3 }]"
            >{{ props.exam.topicName }}</span
          >
        </div>
        <span block text-sm text-gray-600 dark:text-gray-300>{{ props.exam.startTime }}</span>
        <div text-red color-red fill-red>
          <span v-if="props.exam.answeringUrge != 0" text-sm flex="~ items-center">
            <BellAlertIcon class="h-4 m-r-1" />
            {{ props.exam.answeringUrge }}
          </span>
        </div>
      </div>
    </div>
    <div flex="~ items-center" transition-transform duration-200 group-hover:translate-x-1>
      <ChevronRightIcon class="h-5 color-slate-500" />
    </div>
  </div>
</template>
