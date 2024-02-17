<script setup lang="ts">
import { ref, watch } from "vue";
import { type AnswerList } from "@/models/GetQuestionView";
import { NoSymbolIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
  uuid: string;
  answerList: AnswerList[] | undefined;
  initialized: boolean;
}>();

const answerImage = ref<string | undefined>("");
const answerComment = ref<string | undefined>("");
const revisedImage = ref<string | undefined>("");
const revisedComment = ref<string | undefined>("");

watch(props, (val) => {
  if (val.answerList == undefined) return;
  for (let i = 0; i < val.answerList.length; i++) {
    const x = val.answerList[i];
    if (x.uuid == val.uuid) {
      answerImage.value = x.examAnswers[0];
      answerComment.value = x.examComments[0];
      revisedImage.value = x.revisingAnswers[0];
      revisedComment.value = x.revisingComments[0];
      break;
    }
  }
});
</script>

<template>
  <div>
    <div flex="~">
      <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
      <span font-bold m-0 m-l-1>我的答案</span>
    </div>
    <div v-if="Boolean(answerImage)" w-full relative m-t-2>
      <img w-full :src="answerImage" />
      <img absolute top-0 left-0 w-full v-if="Boolean(answerComment)" :src="answerComment" />
    </div>
    <div
      v-else
      w-full
      m-t-2
      text-gray-500
      dark:text-gray-300
      flex="~ col items-center justify-center"
    >
      <NoSymbolIcon class="h-8" />
      <span m-t-2>未作答</span>
    </div>
  </div>
  <div m-t-4 v-if="Boolean(revisedImage)">
    <div flex="~">
      <div self-stretch w-1 rounded-full bg-violet="500 dark:300"></div>
      <span m-0 m-l-1>订正答案</span>
    </div>
    <div w-full relative m-t-2>
      <img w-full :src="revisedImage" />
      <img absolute top-0 left-0 w-full v-if="Boolean(revisedComment)" :src="revisedComment" />
    </div>
  </div>
</template>
