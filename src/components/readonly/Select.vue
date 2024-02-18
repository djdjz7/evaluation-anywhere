<script setup lang="ts">
import type { AnswerList, QstAnswer } from "@/models/GetQuestionView";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { ref, watch } from "vue";

enum JudgeResult {
  correct = 0,
  partial = 1,
  wrong = 2,
  unknown = 3,
}

const props = defineProps<{
  uuid: string;
  options: string[];
  answerList: AnswerList[] | undefined;
  qstAnswers: QstAnswer[] | undefined;
  initialized: boolean;
  taskState: number;
}>();

const originalAnswer = ref<string[]>([]);
const revisedAnswer = ref<string[]>([]);
const qstAnswers = ref<string[]>([]);
const answerComment = ref<string[]>([]);
const originalJudgeResult = ref<JudgeResult>(3);
const revisedJudgeResult = ref<JudgeResult>(3);

watch(props, (val) => {
  props.answerList?.forEach((x) => {
    if (x.uuid == val.uuid) {
      originalAnswer.value = x.examAnswers ?? [];
      revisedAnswer.value = x.revisingAnswers ?? [];
      answerComment.value = x.examComments ?? [];

      // 设回答的答案为 A，正确答案为 B
      let flag1 = true; // A 是 B 的子集
      let flag2 = true; // B 是 A 的子集
      for (let i = 0; i < originalAnswer.value.length; i++) {
        if (!answerComment.value.includes(originalAnswer.value[i])) {
          flag1 = false;
          break;
        }
      }
      for (let i = 0; i < answerComment.value.length; i++) {
        if (!originalAnswer.value.includes(answerComment.value[i])) {
          flag2 = false;
          break;
        }
      }
      if (flag1 && flag2) originalJudgeResult.value = JudgeResult.correct;
      else if (flag1) originalJudgeResult.value = JudgeResult.partial;
      else originalJudgeResult.value = JudgeResult.wrong;

      flag1 = true;
      flag2 = true;
      for (let i = 0; i < revisedAnswer.value.length; i++) {
        if (!answerComment.value.includes(revisedAnswer.value[i])) {
          flag1 = false;
          break;
        }
      }
      for (let i = 0; i < answerComment.value.length; i++) {
        if (!revisedAnswer.value.includes(answerComment.value[i])) {
          flag2 = false;
          break;
        }
      }

      if (flag1 && flag2) revisedJudgeResult.value = JudgeResult.correct;
      else if (flag1) revisedJudgeResult.value = JudgeResult.partial;
      else revisedJudgeResult.value = JudgeResult.wrong;
    }
  });
  if (val.taskState != 1) {
    props.qstAnswers?.forEach((x) => {
      if (x.uuid == val.uuid) {
        qstAnswers.value = x.answers ?? [];
      }
    });
  }
});
</script>
<template>
  <div>
    <div flex="~">
      <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
      <span font-bold m-0 m-l-1>我的答案</span>
    </div>
    <div grid="~ cols-4 md:cols-5 lg:cols-7" gap-2 m-t-2>
      <div v-for="option in options" flex="~ items-center" h-10>
        <label
          relative
          flex-grow-1
          :for="uuid + option"
          bg="white dark:dark"
          shadow-md
          h-full
          flex="~ items-center justify-center"
          rounded-md
          :class="[
            {
              '!bg-violet-500 !dark:bg-violet-300 !text-white !dark:text-black !shadow-violet-300 !dark:shadow-violet-700':
                originalAnswer.indexOf(option) >= 0 &&
                (originalJudgeResult == JudgeResult.unknown || taskState == 1),
            },
            {
              '!bg-green-500 !dark:bg-green-300 !text-white !dark:text-black !shadow-green-300 !dark:shadow-green-700':
                originalAnswer.indexOf(option) >= 0 && originalJudgeResult == JudgeResult.correct,
            },
            {
              '!bg-amber-500 !dark:bg-amber-300 !text-white !dark:text-black !shadow-amber-300 !dark:shadow-amber-700':
                originalAnswer.indexOf(option) >= 0 && originalJudgeResult == JudgeResult.partial,
            },
            {
              '!bg-red-500 !dark:bg-red-300 !text-white !dark:text-black !shadow-red-300 !dark:shadow-red-700':
                originalAnswer.indexOf(option) >= 0 && originalJudgeResult == JudgeResult.wrong,
            },
          ]"
          >{{ option }}
          <div
            v-if="qstAnswers.indexOf(option) >= 0"
            absolute
            h-6
            w-6
            class="-top-3 -right-1"
            z-1
            rounded-full
            bg-white
            dark:bg-dark
            shadow="sm green-700/20 dark:green-300/40"
            flex="~ items-center justify-center"
          >
            <CheckIcon class="h-4 w-4 text-green-500 dark:text-green-300" /></div
        ></label>
      </div>
    </div>
    <div v-if="revisedAnswer.length > 0" m-t-4>
      <div flex="~">
        <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
        <span font-bold m-0 m-l-1>订正答案</span>
      </div>
      <div grid="~ cols-4 md:cols-5 lg:cols-7" gap-2 m-t-2>
        <div v-for="option in options" flex="~ items-center" h-10>
          <label
            relative
            flex-grow-1
            :for="uuid + option"
            bg="white dark:dark"
            shadow-md
            h-full
            flex="~ items-center justify-center"
            rounded-md
            :class="[
              {
                '!bg-violet-500 !dark:bg-violet-300 !text-white !dark:text-black !shadow-violet-300 !dark:shadow-violet-700':
                  revisedAnswer.indexOf(option) >= 0 && revisedJudgeResult == JudgeResult.unknown,
              },
              {
                '!bg-green-500 !dark:bg-green-300 !text-white !dark:text-black !shadow-green-300 !dark:shadow-green-700':
                  revisedAnswer.indexOf(option) >= 0 && revisedJudgeResult == JudgeResult.correct,
              },
              {
                '!bg-amber-500 !dark:bg-amber-300 !text-white !dark:text-black !shadow-amber-300 !dark:shadow-amber-700':
                  revisedAnswer.indexOf(option) >= 0 && revisedJudgeResult == JudgeResult.partial,
              },
              {
                '!bg-red-500 !dark:bg-red-300 !text-white !dark:text-black !shadow-red-300 !dark:shadow-red-700':
                  revisedAnswer.indexOf(option) >= 0 && revisedJudgeResult == JudgeResult.wrong,
              },
            ]"
            >{{ option }}
            <div
              v-if="qstAnswers.indexOf(option) >= 0"
              absolute
              h-6
              w-6
              class="-top-3 -right-1"
              z-1
              rounded-full
              bg-white
              dark:bg-dark
              shadow="sm green-700/20 dark:green-300/40"
              flex="~ items-center justify-center"
            >
              <CheckIcon class="h-4 w-4 text-green-500 dark:text-green-300" /></div
          ></label>
        </div>
      </div>
    </div>
  </div>
</template>
